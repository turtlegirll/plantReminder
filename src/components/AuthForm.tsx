import { useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function signUp() {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Account created. Check your email if confirmation is required.");
    }

    async function signIn() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Logged in.");
    }

    return (
        <div className="card bg-base-200 shadow-md max-w-md mx-auto">
            <div className="card-body">
                <h2 className="card-title">Login</h2>

                <input
                    className="input input-bordered"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="input input-bordered"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={signIn}>
                        Log in
                    </button>

                    <button className="btn btn-secondary" onClick={signUp}>
                        Sign up
                    </button>
                </div>

                {message && <p>{message}</p>}
            </div>
        </div>
    );
}