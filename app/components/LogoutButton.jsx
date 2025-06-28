import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Sei sicuro di voler uscire?");
    if (confirmed) {
      setClicked(true);
      // Aggiungiamo un piccolo delay per mostrare l'animazione
      setTimeout(() => signOut(), 200);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded transition-all duration-200 transform ${
        clicked ? "scale-95 opacity-80" : ""
      }`}
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" />
      Logout
    </button>
  );
};

export default LogoutButton;
