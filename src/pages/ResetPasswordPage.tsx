import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function resetPassword() {
        if (!password) {
            setMessage("Please enter a new password.");
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMessage(error.message);
            return;
        }
        setMessage("Password reset successfully.");
       // sessionStorage.removeItem("passwordRecovery");

        setTimeout(() => {
            navigate("/");
        }, 2000);
    }

    return (<main className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                Reset password
            </h1>

            <input
                type="password"
                className="input input-bordered w-full"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="btn btn-primary w-full mt-4"
                onClick={resetPassword}
            >
                Update password
            </button>

            {message && (
                <p className="text-sm mt-4">
                    {message}
                </p>
            )}
        </div>
    </main>
    );
}
