import { useState } from "react";
import type { Plant } from "../types/plants";

type Props = {
    onAdd: (plant:Plant) => void
}



export function AddPlantForm({onAdd}: Props) {
    const [name, setName] = useState("");
    const [wateringIntervalDays, setWateringInterval] = useState(7);



    return (
        <form onSubmit={(event)=>{
            event.preventDefault();
            const newPlant: Plant = {
                id: Date.now(),
                name: name,
                wateringIntervalDays: wateringIntervalDays,
                lastWatered: new Date().toISOString(),
            };

            onAdd(newPlant);

            setName("");
            setWateringInterval(7);


        }}>
            <label> Plant name </label>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <label> Water every </label>
            <input
                type="number"
                value={wateringIntervalDays}
                onChange={(event) => setWateringInterval(Number(event.target.value))}
            /> days

            <button type="submit">Add Plant</button>
        </form>

    )

}