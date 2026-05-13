import { createSupabaseServerClient } from "./supabase";

export interface BoardMemberSkill {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_avatar: string | null;
  skill_category: string;
  skill_name: string;
  proficiency_level: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillDefinition {
  id: string;
  category: string;
  skill_name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export const skillsDb = {
  /**
   * Get all skill definitions (categories and skills)
   */
  async getSkillDefinitions(): Promise<SkillDefinition[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("skill_definitions")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("display_order");

    if (error) {
      console.error("Error fetching skill definitions:", error);
      return [];
    }
    return data || [];
  },

  /**
   * Get skills for a specific board member by email
   */
  async getBoardMemberSkills(userEmail: string): Promise<BoardMemberSkill[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("board_member_skills")
      .select("*")
      .eq("user_email", userEmail)
      .order("skill_category")
      .order("skill_name");

    if (error) {
      console.error("Error fetching board member skills:", error);
      return [];
    }
    return data || [];
  },

  /**
   * Get all board members' skills (for results page)
   */
  async getAllBoardMemberSkills(): Promise<BoardMemberSkill[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("board_member_skills")
      .select("*")
      .order("user_name")
      .order("skill_category")
      .order("skill_name");

    if (error) {
      console.error("Error fetching all board member skills:", error);
      return [];
    }
    return data || [];
  },

  /**
   * Upsert a board member skill (create or update)
   */
  async upsertBoardMemberSkill(
    userEmail: string,
    userName: string,
    userAvatar: string | null,
    skillCategory: string,
    skillName: string,
    proficiencyLevel: number,
    notes?: string
  ): Promise<BoardMemberSkill | null> {
    const supabase = createSupabaseServerClient();

    const { data: existing } = await supabase
      .from("board_member_skills")
      .select("id")
      .eq("user_email", userEmail)
      .eq("skill_category", skillCategory)
      .eq("skill_name", skillName)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("board_member_skills")
        .update({
          proficiency_level: proficiencyLevel,
          notes: notes || null,
          user_name: userName,
          user_avatar: userAvatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating skill:", error);
        return null;
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from("board_member_skills")
        .insert({
          user_email: userEmail,
          user_name: userName,
          user_avatar: userAvatar,
          skill_category: skillCategory,
          skill_name: skillName,
          proficiency_level: proficiencyLevel,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting skill:", error);
        return null;
      }
      return data;
    }
  },

  /**
   * Bulk upsert board member skills
   */
  async bulkUpsertBoardMemberSkills(
    userEmail: string,
    userName: string,
    userAvatar: string | null,
    skills: Array<{
      skillCategory: string;
      skillName: string;
      proficiencyLevel: number;
      notes?: string;
    }>
  ): Promise<BoardMemberSkill[]> {
    const results: BoardMemberSkill[] = [];
    for (const skill of skills) {
      const result = await this.upsertBoardMemberSkill(
        userEmail,
        userName,
        userAvatar,
        skill.skillCategory,
        skill.skillName,
        skill.proficiencyLevel,
        skill.notes
      );
      if (result) {
        results.push(result);
      }
    }
    return results;
  },

  /**
   * Get board members who have completed their skills assessment
   */
  async getMembersWithSkills(): Promise<
    Array<{
      user_email: string;
      user_name: string;
      user_avatar: string | null;
      skills_count: number;
      last_updated: string | null;
    }>
  > {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_members_with_skills");

    if (error) {
      console.error("Error fetching members with skills:", error);
      const allSkills = await this.getAllBoardMemberSkills();
      const memberMap = new Map<
        string,
        {
          user_email: string;
          user_name: string;
          user_avatar: string | null;
          skills_count: number;
          last_updated: string | null;
        }
      >();

      for (const skill of allSkills) {
        const existing = memberMap.get(skill.user_email);
        if (existing) {
          existing.skills_count++;
          if (
            skill.updated_at &&
            (!existing.last_updated || skill.updated_at > existing.last_updated)
          ) {
            existing.last_updated = skill.updated_at;
          }
        } else {
          memberMap.set(skill.user_email, {
            user_email: skill.user_email,
            user_name: skill.user_name,
            user_avatar: skill.user_avatar,
            skills_count: 1,
            last_updated: skill.updated_at,
          });
        }
      }

      return Array.from(memberMap.values());
    }

    return data || [];
  },

  /**
   * Get skill statistics across all board members
   */
  async getSkillsStatistics(): Promise<
    Array<{
      skill_category: string;
      skill_name: string;
      member_count: number;
      avg_proficiency: number;
      max_proficiency: number;
      min_proficiency: number;
    }>
  > {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_skills_statistics");

    if (error) {
      console.error("Error fetching skills statistics:", error);
      const allSkills = await this.getAllBoardMemberSkills();
      const statsMap = new Map<
        string,
        {
          skill_category: string;
          skill_name: string;
          levels: number[];
        }
      >();

      for (const skill of allSkills) {
        const key = `${skill.skill_category}|${skill.skill_name}`;
        const existing = statsMap.get(key);
        if (existing) {
          existing.levels.push(skill.proficiency_level);
        } else {
          statsMap.set(key, {
            skill_category: skill.skill_category,
            skill_name: skill.skill_name,
            levels: [skill.proficiency_level],
          });
        }
      }

      return Array.from(statsMap.values()).map((stat) => ({
        skill_category: stat.skill_category,
        skill_name: stat.skill_name,
        member_count: stat.levels.length,
        avg_proficiency:
          stat.levels.reduce((a, b) => a + b, 0) / stat.levels.length,
        max_proficiency: Math.max(...stat.levels),
        min_proficiency: Math.min(...stat.levels),
      }));
    }

    return data || [];
  },
};
