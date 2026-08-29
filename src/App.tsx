import { useEffect, useState } from "react";
import type { Plant } from "./types/plants"
import { PlantCard } from "./components/PlantCard";
import { AddPlantForm } from "./components/PlantForm";

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

function App() {
  const [plants, setPlants] = useState<Plant[]>(() => {
    const savedPlants = localStorage.getItem("plants");

    if (!savedPlants) {
      return initialPlants;
    }

    return JSON.parse(savedPlants);
  });

  useEffect(() => { localStorage.setItem("plants", JSON.stringify(plants)) })

  function waterPlant(id: number) {

    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: new Date().toISOString() } : plant
      )
    );
  }

  function addPlant(plant: Plant) {
    setPlants((currentPlants) =>
      [...currentPlants, plant]
    )
  }

  function removePlant(id: number){
    setPlants((currentPlants)=>
      currentPlants.filter((plant)=> plant.id !== id)
    );
  }


  return (
    <main className="min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-8">
        My Plants
      </h1>

      <AddPlantForm onAdd={addPlant} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onWater={waterPlant}
            onDelete={removePlant}
          />
        ))}
      </div>
    </main>

  )
}

export default App;