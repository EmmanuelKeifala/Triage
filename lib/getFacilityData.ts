import { supabase } from "./supabase";

interface Facility {
  facilitycode: string;
  [key: string]: any;
}

const getData = async (facilityCode: string): Promise<Facility[] | null> => {
  try {
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("facilitycode", facilityCode);

    if (error) {
      throw error;
    }

    return data.length > 0 ? data : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default getData;
