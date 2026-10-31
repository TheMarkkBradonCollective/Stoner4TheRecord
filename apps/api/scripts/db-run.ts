import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..", "..");

function loadEnvDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "DATABASE_URL is required. Export it from your Neon project (stoner4therecord) before running migrations.",
    );
    process.exit(1);
  }
  return url;
}

async function runSqlFile(
  sql: { query: (query: string) => Promise<unknown> },
  path: string,
) {
  const raw = readFileSync(path, "utf8");
  const body = raw
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");
  const statements = body
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  for (const statement of statements) {
    await sql.query(`${statement};`);
  }
  console.log(`Applied: ${path} (${statements.length} statements)`);
}

async function migrate() {
  const sql = neon(loadEnvDatabaseUrl());
  const migrationsDir = join(repoRoot, "db", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await runSqlFile(sql, join(migrationsDir, file));
  }
}

async function seed() {
  const sql = neon(loadEnvDatabaseUrl());
  const seedDir = join(repoRoot, "db", "seed");
  const files = readdirSync(seedDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await runSqlFile(sql, join(seedDir, file));
  }
}

const command = process.argv[2];
if (command === "migrate") {
  await migrate();
} else if (command === "seed") {
  await seed();
} else {
  console.error("Usage: tsx scripts/db-run.ts <migrate|seed>");
  process.exit(1);
}
