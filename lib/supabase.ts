import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Statistics features will not work. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Statistics-specific database functions
export const statsDb = {
  /**
   * Get latest Xogos statistics
   */
  async getStatistics() {
    const { data, error } = await supabase
      .from("xogos_statistics")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching statistics:", error);
      throw error;
    }

    return data;
  },

  /**
   * Get historical Xogos statistics (for trending/graphs)
   */
  async getStatisticsHistory(
    limit: number = 30,
    startDate?: Date,
    endDate?: Date
  ) {
    let query = supabase
      .from("xogos_statistics")
      .select("*")
      .order("last_updated", { ascending: false })
      .limit(limit);

    if (startDate) {
      query = query.gte("last_updated", startDate.toISOString());
    }

    if (endDate) {
      query = query.lte("last_updated", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching statistics history:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Update Xogos statistics (creates a new record for history)
   */
  async updateStatistics(
    accounts: number,
    activeUsers: number,
    totalHours: number,
    updatedBy: string
  ) {
    const { data, error } = await supabase
      .from("xogos_statistics")
      .insert({
        accounts,
        active_users: activeUsers,
        total_hours: totalHours,
        updated_by: updatedBy,
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating statistics:", error);
      throw error;
    }

    return data;
  },
};
