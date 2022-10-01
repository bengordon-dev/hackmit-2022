async function calculateDistance(origin, destination) {
    await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
}

const res = await calculateDistance('gates dell complex', 'skyloft');
console.log(res)