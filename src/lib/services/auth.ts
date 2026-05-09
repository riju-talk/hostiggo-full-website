import { supabase } from "../supabase";
import { VerifyOtpParams } from "@supabase/supabase-js";

export const authApi = {
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  signInWithOtp: async (phone: string) => {
    return await supabase.auth.signInWithOtp({ phone });
  },

  verifyOtp: async (phone: string, token: string) => {
    return await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  },

  updateUser: async (attributes: { phone: string }) => {
    return await supabase.auth.updateUser(attributes);
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
