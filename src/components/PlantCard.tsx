import { useState } from "react";
import type { Plant } from "../types/plants"
import { Trash2, Pencil, Droplets } from "lucide-react";


type Props = {
    plant: Plant,
    onWater: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, updatedPlant: Partial<Plant>) => void;
}
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getNextWateringDate(plant: Plant) {
    const nextDate = new Date(plant.lastWatered);

    nextDate.setDate(
        nextDate.getDate() + plant.wateringIntervalDays
    );

    return nextDate;
}

function getDaysUntilWatering(plant: Plant) {

    const lastWatered = new Date(plant.lastWatered);

    const nextWatering = new Date(lastWatered);

    nextWatering.setDate(nextWatering.getDate() + plant.wateringIntervalDays);

    const today = new Date();

    const difference = Math.ceil((nextWatering.getTime() - today.getTime()) / MS_PER_DAY);

    console.log(difference)
    return difference;
}

function formatDayMonth(date: Date) {
    const formattedDate = Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit"
    }).format(date).replace(/\.$/, "");

    return formattedDate;
}



export function PlantCard({ plant, onWater, onDelete, onEdit }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(plant.name);
    const [editedWateringInterval, setEditedWateringInterval] = useState(plant.wateringIntervalDays);
    const [editedLastWatered, setEditedLastWatered] = useState(plant.lastWatered);

    const nextWateringDay = getDaysUntilWatering(plant)
    const nextWateringDate = getNextWateringDate(plant)

    const handleEdit = () => {
        onEdit(plant.id, { name: editedName, wateringIntervalDays: editedWateringInterval, lastWatered: editedLastWatered });
        setIsEditing(false);
    }

    return (

        <article className="card bg-base-200 shadow-md">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <h2 className="card-title">
                        {plant.name}
                    </h2>
                    <div className="flex gap-3">
                        <button
                            className="btn btn-warning btn-square btn-sm"
                            onClick={() => setIsEditing(true)}
                            aria-label={`Edit ${plant.name}`}
                        >
                            <Pencil size={18} />
                        </button>

                        <button
                            className="btn btn-square btn-sm btn-error"
                            onClick={() => onDelete(plant.id)}
                            aria-label={`Delete ${plant.name}`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Plant name"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="input input-bordered input-sm w-full"
                        />
                        <input
                            type="date"
                            placeholder="Last watered"
                            value={editedLastWatered}
                            onChange={(e) => setEditedLastWatered(e.target.value)}
                            className="input input-bordered input-sm w-full"
                        />
                        <input
                            type="number"
                            placeholder="Watering interval (days)"
                            value={editedWateringInterval}
                            onChange={(e) => setEditedWateringInterval(Number(e.target.value))}
                            className="input input-bordered input-sm w-full"
                        />
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-success" onClick={handleEdit}>Save</button>
                            <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm opacity-70">
                            This plant should be watered approximately every {plant.wateringIntervalDays} days :)
                        </p>
                        <p>
                            Last watered {(new Date(plant.lastWatered).toLocaleDateString("de-DE"))}
                        </p>
                        <p className="font-semibold">
                            Water in  {nextWateringDay} days (on {formatDayMonth(nextWateringDate)})
                        </p>
                    </>
                )}
                <div className="card-actions mt-4">
                    <button className="btn btn-primary" onClick={() => onWater(plant.id)} disabled={isEditing}
                    >  <Droplets size={18} />Water</button>

                </div>
            </div>
        </article>
    )
}