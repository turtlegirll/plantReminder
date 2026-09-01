import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function AccountPage() {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ntfyTopic, setNtfyTopic] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    useEffect(() => {
        async function checkUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setCurrentUser(user);

            if (!user) {
                return;
            }

            const { data, error } = await supabase
                .from("profile")
                .select("ntfy_topic")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error("Error loading notification settings:", error);
                return;
            }

            setNtfyTopic(data?.ntfy_topic ?? "");
        }

        checkUser();
    }, []);

    async function signUp() {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Account created. Check your email to confirm your account.");
    }

    async function signIn() {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        navigate("/");
    }

    async function saveNotificationSettings() {
        if (!currentUser) {
            return;
        }

        setLoading(true);
        setMessage("");

        const { error } = await supabase
            .from("profile")
            .upsert(
                {
                    user_id: currentUser.id,
                    ntfy_topic: ntfyTopic.trim(),
                },
                {
                    onConflict: "user_id",
                }
            );

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Notification settings saved.");
    }

    async function logOut() {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signOut();

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        navigate("/");
    }

    async function resetPassword() {
        if (!email || isResettingPassword) {
            setMessage("Please enter your email to reset your password.");
            return;
        }
        setIsResettingPassword(true);

        const redirectTo =
            window.location.hostname === "localhost"
                ? "http://localhost:5173/"
                : "https://turtlegirll.github.io/plantReminder/";

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (error) {
            setMessage(error.message);
            setIsResettingPassword(false);
            return;
        }

        setMessage("Check your email for a password reset link.");
        setIsResettingPassword(false);
    }

    return (
        <main className="min-h-screen p-6">
            <div className="max-w-md mx-auto">
                <Link to="/" className="btn btn-ghost btn-sm mb-6">
                    <ArrowLeft size={18} />
                    Back
                </Link>

                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        {currentUser ? (
                            <>
                                <h1 className="card-title text-2xl">Your account</h1>

                                <div className="py-3">
                                    <p className="text-sm opacity-70">Email:</p>
                                    <p className="font-semibold">{currentUser.email}</p>
                                </div>

                                <div className="card bg-base-200 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg">
                                            Watering notifications
                                        </h2>

                                        <p className="text-sm opacity-80">
                                            This app uses ntfy to send watering reminders to your phone.
                                        </p>

                                        <ol className="list-decimal list-inside space-y-2 text-sm">
                                            <li>Install the ntfy app on your phone.</li>
                                            <li>In ntfy, add [placeholder sorry] as your notification server</li>
                                            <li>Create or subscribe to a topic with a unique name, for example my-plants-a8f3k2.</li>
                                            <li>Enter the same topic name below and save your settings.</li>
                                        </ol>

                                        <div className="bg-base-300 rounded-lg p-4 mt-2">
                                            <p className="text-sm opacity-70">
                                                <strong className="text-base-content">Tip:</strong>{" "}
                                                Your topic acts as the destination for your notifications.
                                                Choose something unique and don't share it with other users.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <label className="form-control">
                                    <span className="label-text mb-1">ntfy topic</span>

                                    <input
                                        className="input input-bordered w-full"
                                        type="text"
                                        placeholder="my-plant-reminders"
                                        value={ntfyTopic}
                                        onChange={(e) => setNtfyTopic(e.target.value)}
                                    />
                                </label>

                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={saveNotificationSettings}
                                    disabled={loading}
                                >
                                    Save notification settings
                                </button>

                                <button
                                    className="btn btn-error mt-4"
                                    onClick={logOut}
                                    disabled={loading}
                                >
                                    Log out
                                </button>

                                {message && (
                                    <p className="text-sm mt-3">
                                        {message}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <h1 className="card-title text-2xl">Your account</h1>

                                <label className="form-control">
                                    <span className="label-text mb-1">Email</span>

                                    <input
                                        className="input input-bordered w-full"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-1">Password</span>

                                    <input
                                        className="input input-bordered w-full"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />

                                        <button
                                            type="button"
                                            className="btn btn-link px-0"
                                            onClick={resetPassword}
                                            disabled={isResettingPassword}
                                        >
                                            {isResettingPassword ? "Sending email, wait a little :)" : "Forgot password?"}

                                        </button>

                                        {message && (
                                            <p className="text-sm mt-3">
                                                {message}
                                            </p>
                                        )}
                                </label>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="btn btn-primary"
                                        onClick={signIn}
                                        disabled={loading}
                                    >
                                        Log in
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={signUp}
                                        disabled={loading}
                                    >
                                        Create account
                                    </button>
                                </div>


                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}