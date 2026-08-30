import { useState } from "react";
import type { Plant } from "../types/plants";

type Props = {
    onAdd: (plant: Plant) => void
}



export function AddPlantForm({ onAdd }: Props) {
    const [name, setName] = useState("");
    const [wateringIntervalDays, setWateringInterval] = useState(7);
    const [lastWatered, setLastWatered] = useState(
        new Date().toISOString().split("T")[0]
    );

    return (
        <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-base-200 p-4"
            onSubmit={(event) => {
                event.preventDefault();
                const newPlant: Plant = {
                    id: Date.now(),
                    name: name,
                    wateringIntervalDays: wateringIntervalDays,
                    lastWatered: lastWatered,
                };

                onAdd(newPlant);
                setName("");
                setWateringInterval(7);
            }}>

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

            <button className="btn btn-primary btn-sm" type="submit">
                Add
            </button>

        </form>
    )

}