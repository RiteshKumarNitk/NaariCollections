import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccount.json", "utf-8")
);

const envContent = `
FIREBASE_PROJECT_ID=${serviceAccount.project_id}
FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, "\\n")}"
`;

fs.writeFileSync(".env.local", envContent.trim() + "\n");
console.log("✅ .env.local generated successfully!");
