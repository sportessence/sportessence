"use client";
import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await updatePassword(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/Login"); 
    }
  };

  return (
    <main className="min-h-screen bg-cream flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-deep mb-4">Imposta Nuova Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nuova Password</label>
            <input name="password" type="password" required minLength={8} className="w-full border p-2 rounded mt-1" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700">
            Salva Password
          </button>
        </form>
      </div>
    </main>
  );
}