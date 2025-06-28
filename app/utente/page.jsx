"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import LogoutButton from "../components/LogoutButton";

export default function PaginaUtente() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading") return <p>Caricamento sessione...</p>;
  if (!session) {
    router.push("/");
    return null;
  }

  if (!userData) return <p>Caricamento dati utente...</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50 text-black mt-16">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <Image
          src={userData.image || "/default-avatar.png"}
          alt="Avatar utente"
          width={80}
          height={80}
          className="rounded-full mx-auto"
        />
        <h1 className="text-2xl font-semibold mt-4">{userData.name}</h1>
        <p className="text-gray-600">{userData.email}</p>

        <div className="mt-4">
          <p>
            <strong>Creato il:</strong>{" "}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {userData.status}
          </p>
          <p>
            <strong>Criptovalute salvate:</strong>{" "}
            {userData.savedCryptos?.length || 0}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
