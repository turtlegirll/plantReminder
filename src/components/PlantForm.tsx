import { useState } from "react";
import type { Plant } from "../types/plants";

type Props = {
    onAdd: (plant: Plant) =>Promise<void>;
}


export function AddPlantForm({ onAdd }: Props) {
    const [name, setName] = useState("");
    const [wateringIntervalDays, setWateringInterval] = useState(7);
    const [lastWatered, setLastWatered] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [isAddingPlant, setIsAddingPlant] = useState(false);

    function isPlantValid() {
        return (
            name.trim() !== "" &&
            wateringIntervalDays > 0 &&
            lastWatered !== ""
        );
    }
    async function handleAddPlant(event: React.FormEvent) {
        event.preventDefault();

        if (!name || !wateringIntervalDays || !lastWatered) {
            return;
        }

        if (isAddingPlant) {
            return;
        }

        setIsAddingPlant(true);

        const newPlant: Plant = {
            id: Date.now(),
            name: name,
            wateringIntervalDays: wateringIntervalDays,
            lastWatered: lastWatered,
        };

        try {
            await onAdd(newPlant);
            setName("");
            setWateringInterval(7);
        } finally {
            setIsAddingPlant(false);
        }
    }

    return (
        <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-base-200 p-4"
            onSubmit={handleAddPlant}>
            <label className="flex flex-col gap-1">
                <span className="text-xs">Plant</span>
                <input
                    className="input input-bordered input-sm w-40"
                    placeholder="Monstera"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-xs">Last watered</span>
                <input
                    className="input input-bordered input-sm"
                    type="date"
                    value={lastWatered}
                    onChange={(event) => setLastWatered(event.target.value)}
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-xs">Water every</span>

                <div className="flex items-center gap-2">
                    <input
                        className="input input-bordered input-sm w-20"
                        type="number"
                        value={wateringIntervalDays}
                        onChange={(event) =>
                            setWateringInterval(Number(event.target.value))
                        }
                    />
                    <span className="text-sm opacity-60">days</span>
                </div>
            </label>

            <button className="btn btn-primary btn-sm" type="submit" disabled={!isPlantValid() || isAddingPlant} >
                Add
            </button>

        </form>
    )

}