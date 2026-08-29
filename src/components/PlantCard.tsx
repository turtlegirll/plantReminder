import type { Plant } from "../types/plants"

type Props = {
    plant: Plant,
    onWater: (id: number) => void;
}
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getNextWateringDate(plant: Plant) {
    const nextDate = new Date(plant.lastWatered);

    nextDate.setDate(
        nextDate.getDate() + plant.wateringIntervalDays
    );

    return nextDate;
}

function getDaysUntilWatering(plant: Plant){

    const lastWatered = new Date(plant.lastWatered);

    const nextWatering = new Date(lastWatered);

    nextWatering.setDate(nextWatering.getDate() + plant.wateringIntervalDays);

    const today = new Date();

    const difference = Math.ceil((nextWatering.getTime() - today.getTime()) / MS_PER_DAY);

    console.log(difference)
    return difference;
}

function formatDayMonth(date: Date){
    const formattedDate =  Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit"
    }).format(date).replace(/\.$/, "");

    return formattedDate;
}



export function PlantCard({ plant, onWater }: Props) {

    const nextWateringDay = getDaysUntilWatering(plant)
    const nextWateringDate = getNextWateringDate(plant)


    return (

        <article>
            <h2>{plant.name}</h2>

            <p>
                Last watered {(new Date(plant.lastWatered).toLocaleDateString("de-DE"))}
            </p>
            <p>
                Water in  {nextWateringDay} days (on {formatDayMonth(nextWateringDate)})
            </p>
            <p>
                This plant should be watered approximately every {plant.wateringIntervalDays} days :)
            </p>
            <button onClick={() => onWater(plant.id)}></button>

        </article>
    )
}