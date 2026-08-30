import { useEffect, useState } from "react";
import type { Plant } from "./types/plants"
import { PlantCard } from "./components/PlantCard";
import { AddPlantForm } from "./components/PlantForm";
import { sendNtfyNotification } from "./services/ntfy";

const initialPlants: Plant[] = [
  {
    id: 1,
    name: "Zanzibar Gem",
    wateringIntervalDays: 14,
    lastWatered: new Date("2026-08-23").toISOString(),
  },

  {
    id: 2,
    name: "Money Plant",
    wateringIntervalDays: 12,
    lastWatered: new Date("2026-08-23").toISOString(),
  },

  {
    id: 3,
    name: "Ficus Benjamin",
    wateringIntervalDays: 12,
    lastWatered: new Date("2026-08-23").toISOString(),
  }
];



async function testNotification() {
  try {
    await sendNtfyNotification(
      "plantReminder-x7k29agi",
      "Plant Reminder",
      "Test notification from my React app"
    );
  } catch (error) {
    console.error(error);
  }
}


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

  async function waterPlant(id: number) {

    const plant = plants.find((plant) => plant.id === id);
    if (!plant) return;
    const wateredToday = new Date();


    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: wateredToday.toISOString() } : plant
      )

    );

    await sendNtfyNotification(
      "plantReminder-x7k29agi",
      "Plant watered",
      `${plant.name} was watered today`
    );
  }

  function addPlant(plant: Plant) {
    setPlants((currentPlants) =>
      [...currentPlants, plant]
    );
  }

  function removePlant(id: number) {
    setPlants((currentPlants) =>
      currentPlants.filter((plant) => plant.id !== id)
    );
  }

  function editPlant(id: number, updatedPlant: Partial<Plant>) {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id ? { ...plant, ...updatedPlant } : plant
      )
    );
  }


  return (
    <main className="min-h-screen p-8">

      <div className="grid gap-1
   sm:grid-cols-4 lg:grid-cols-3 mt-8">

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
      <button
        className="btn btn-secondary"
        onClick={testNotification}
      >
        Test notification
      </button>
    </main>

  )
}

export default App;