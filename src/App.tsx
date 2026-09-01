import { useEffect, useState } from "react";
import type { Plant } from "./types/plants"
import { PlantCard } from "./components/PlantCard";
import { AddPlantForm } from "./components/PlantForm";
import { sendNtfyNotification } from "./services/ntfy";
import { supabase } from "./lib/supabase";

const initialPlants: Plant[] = [
  {
    id: 1,
    name: "Zanzibar Gem",
    wateringIntervalDays: 14,
    lastWatered: new Date("2026-08-23").toISOString(),
    ntfyTopic: "",
  },

  {
    id: 2,
    name: "Money Plant",
    wateringIntervalDays: 12,
    lastWatered: new Date("2026-08-23").toISOString(),
    ntfyTopic: "",
  },

  {
    id: 3,
    name: "Ficus Benjamin",
    wateringIntervalDays: 12,
    lastWatered: new Date("2026-08-23").toISOString(),
    ntfyTopic: "",
  }
];



function App() {
  const [isAdded, setIsAdded] = useState(false);
  const [plants, setPlants] = useState<Plant[]>(() => {
    const savedPlants = localStorage.getItem("plants");

    if (!savedPlants) {
      return initialPlants;
    }

    return JSON.parse(savedPlants);
  });

  useEffect(() => { localStorage.setItem("plants", JSON.stringify(plants)) })

  useEffect(() => {
    async function loadPlants() {
      const { data, error } = await supabase
        .from("plants")
        .select("*");

      console.log("SUPABASE DATA:", data);
      console.log("SUPABASE ERROR:", error);

      if (error) {
        return;
      }

      if (!data || data.length === 0) {
        console.log("No plants found in Supabase");
        return;
      }

      const mappedPlants: Plant[] = data.map((plant) => ({
        id: plant.id,
        name: plant.name,
        wateringIntervalDays: plant.watering_interval_days,
        lastWatered: plant.last_watered,
        ntfyTopic: plant.ntfy_topic ?? "",
      }));

      setPlants(mappedPlants);
    }

    loadPlants();
  }, []);
  async function waterPlant(id: number) {

    const plant = plants.find((plant) => plant.id === id);
    if (!plant) return;
    const wateredToday = new Date();
    const topic = plant.ntfyTopic ?? "";

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

    await sendNtfyNotification(
      topic,
      "Plant watered",
      `${plant.name} was watered today`
    );
  }

  function addPlant(plant: Plant) {
    setPlants((currentPlants) =>
      [...currentPlants, plant]
    );

    async function savePlantToSupabase() {
      const { error } = await supabase
        .from("plants")
        .insert([
          {
            id: plant.id,
            name: plant.name,
            watering_interval_days: plant.wateringIntervalDays,
            last_watered: plant.lastWatered,
            ntfy_topic: plant.ntfyTopic ?? "",
          }
        ]);

      if (error) {
        console.error("Error adding plant to Supabase:", error);
      } else {
        console.log("Plant added to Supabase successfully");
      }
    }

    savePlantToSupabase();
  }

  function removePlant(id: number) {
    setPlants((currentPlants) =>
      currentPlants.filter((plant) => plant.id !== id)
    );


    async function deletePlantFromSupabase() {
      const { error } = await supabase
        .from("plants")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting plant from Supabase:", error);
      } else {
        console.log("Plant deleted from Supabase successfully");
      }
    }

    deletePlantFromSupabase();
  }

  function editPlant(id: number, updatedPlant: Partial<Plant>) {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id ? { ...plant, ...updatedPlant } : plant
      )
    );

    async function updatePlantInSupabase() {
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
      } else {
        console.log("Plant updated in Supabase successfully");
      }
    }

    updatePlantInSupabase();
  }


  return (
    <main className="min-h-screen p-8">
      <div className="grid gap-1 sm:grid-cols-4 lg:grid-cols-3 mt-8">
        <h1 className="text-5xl font-bold mb-8">
          My Plants
        </h1>
        <button
          className="btn btn-secondary mb-4"
          onClick={() => setIsAdded(!isAdded)}
        >
          Add Plant
        </button>
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

export default App;