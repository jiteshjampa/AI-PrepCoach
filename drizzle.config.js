/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:sL6lOywa1XWf@ep-blue-fog-a52tcdjm.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require",
  },
};
