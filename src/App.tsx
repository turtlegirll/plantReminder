import { useEffect, useState } from "react";
import type { Plant } from "./types/plants"
import { PlantCard } from "./components/PlantCard";
import { AddPlantForm } from "./components/PlantForm";
import { sendNtfyNotification } from "./services/ntfy";
import { supabase } from "./lib/supabase";
import { Link, Route, Routes } from "react-router-dom";
import { AccountPage } from "./pages/AccountPage.tsx";
import { UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";

function PlantApp() {
  const [isAdded, setIsAdded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    async function getUser() {
      const { data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    async function loadPlants() {
      if (!user) {
        setPlants([]);
        return;
      }

      const { data, error } = await supabase
        .from("plants")
        .select("*");

      if (error) {
        console.error("SUPABASE ERROR:", error);
        setPlants([]);
        return;
      }

      const mappedPlants: Plant[] = (data ?? []).map((plant) => ({
        id: plant.id,
        name: plant.name,
        wateringIntervalDays: plant.watering_interval_days,
        lastWatered: plant.last_watered,
      }));

      setPlants(mappedPlants);
    }

    loadPlants();
  }, [user]);


  async function waterPlant(id: number) {
    const wateredToday = new Date();
    const plant = plants.find((plant) => plant.id === id);

    if (!plant) return;

    if (!user) {
      console.error("No logged-in user");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("ntfy_topic")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Could not load ntfy topic:", profileError);
      return;
    }
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: wateredToday.toISOString() } : plant
      )

    );

    const { error } = await supabase
      .from("plants")
      .update({ last_watered: wateredToday.toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating plant in Supabase:", error);
    } else {
      console.log("Plant watered in Supabase successfully");
    }

    if (profile?.ntfy_topic) {
      await sendNtfyNotification(
        profile.ntfy_topic,
        "Plant watered",
        `${plant.name} was watered today`
      );
    }
  }

  async function addPlant(plant: Plant) {
    if (!user) {
      console.error("No logged-in user");
      return;
    }

    const { data, error } = await supabase
      .from("plants")
      .insert(
        {
          name: plant.name,
          watering_interval_days: plant.wateringIntervalDays,
          last_watered: plant.lastWatered,
          user_id: user.id,
        })
      .select()
      .single();

    if (error) {
      console.error("Error adding plant to Supabase:", error);
      return;
    }

    const addedPlant: Plant = {
      id: data.id,
      name: data.name,
      wateringIntervalDays: data.watering_interval_days,
      lastWatered: data.last_watered,
    };

    setPlants((currentPlants) => [
      ...currentPlants,
      addedPlant,
    ]);
    console.log("Plant added to Supabase successfully");
  }

  async function removePlant(id: number) {
    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting plant from Supabase:", error);
    }

    setPlants((currentPlants) =>
      currentPlants.filter((plant) => plant.id !== id)
    );

    console.log("Plant deleted from Supabase successfully");

  }

  async function editPlant(id: number, updatedPlant: Partial<Plant>) {
    const supabaseUpdate: any = {};
    if (updatedPlant.name !== undefined) supabaseUpdate.name = updatedPlant.name;
    if (updatedPlant.wateringIntervalDays !== undefined) supabaseUpdate.watering_interval_days = updatedPlant.wateringIntervalDays;
    if (updatedPlant.lastWatered !== undefined) supabaseUpdate.last_watered = updatedPlant.lastWatered;

    const { error } = await supabase
      .from("plants")
      .update(supabaseUpdate)
      .eq("id", id);

    if (error) {
      console.error("Error updating plant in Supabase:", error);
    }

    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id
          ? { ...plant, ...updatedPlant }
          : plant
      )
    );
    console.log("Plant updated in Supabase successfully");

  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-bold">
            My Plants
          </h1>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAdded(!isAdded)}
          >
            Add Plant
          </button>
        </div>

        <div className="flex gap-2 items-center">
          {user?.email && (
            <span className="text-sm">{user.email}</span>
          )}
          <Link
            to="/account"
            className={user ? "btn btn-ghost btn-circle btn-sm" : "btn btn-primary btn-sm"}
            aria-label="Account"
          >
            {user ? (
              <UserRound size={22} />
            ) : (
              <>
                <UserRound size={22} /> Sign up / Log in
              </>
            )}
          </Link>
        </div>
      </div>


      {isAdded && <AddPlantForm onAdd={addPlant} />}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onWater={waterPlant}
            onDelete={removePlant}
            onEdit={editPlant}
          />
        ))}
      </div>

    </main>

  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlantApp />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}

export default App;