import { query } from "./_generated/server";
import { requireAdmin } from "./auth_helpers";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const businesses = await ctx.db.query("businesses").collect();
    const users = await ctx.db.query("users").collect();

    // 1. Total Counts
    const totalBusinesses = businesses.length;
    const totalUsers = users.length;
    const verifiedBusinesses = businesses.filter((b) => b.metadata.isVerified).length;
    const pendingBusinesses = businesses.filter((b) => b.metadata.status === "pending").length;

    // 2. Businesses by Category
    const categoryCounts: Record<string, number> = {};
    businesses.forEach((b) => {
      const primary = b.category.primary;
      categoryCounts[primary] = (categoryCounts[primary] || 0) + 1;
    });

    // 3. Businesses by Status
    const statusCounts: Record<string, number> = {
      active: businesses.filter((b) => b.metadata.status === "active").length,
      inactive: businesses.filter((b) => b.metadata.status === "inactive").length,
      pending: pendingBusinesses,
    };

    // 4. Growth over time (last 30 days)
    // Note: metadata.dateAdded is an ISO string
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBusinesses = businesses.filter((b) => {
      const dateAdded = new Date(b.metadata.dateAdded);
      return dateAdded >= thirtyDaysAgo;
    }).length;

    // 5. Recent Activity (last 5 added)
    const recentActivity = [...businesses]
      .sort(
        (a, b) =>
          new Date(b.metadata.dateAdded).getTime() - new Date(a.metadata.dateAdded).getTime(),
      )
      .slice(0, 5)
      .map((b) => ({
        id: b._id,
        name: typeof b.name === "string" ? b.name : b.name.english,
        dateAdded: b.metadata.dateAdded,
        status: b.metadata.status,
      }));

    return {
      totalBusinesses,
      totalUsers,
      verifiedBusinesses,
      pendingBusinesses,
      categoryCounts: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
      statusCounts: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      recentBusinesses,
      recentActivity,
    };
  },
});
