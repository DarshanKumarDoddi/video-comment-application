import { supabase } from "./supabase";
import { User } from "../types";

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User; access_token: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error("Login failed");
  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? "",
    },
    access_token: data.session.access_token,
  };
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Signup failed");
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    username,
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
  };
}
