


mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpajA3IiwiYSI6ImNscWk1bzhvaDA3aWoya3J5bXJrdml4bTQifQ.UBK8KIngogEH1R1YeYkPsw';
  const map = new mapboxgl.Map({
  container: 'map',
   // container ID
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12 // starting zoom
  });

  const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
.setLngLat(campground.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
  .setHTML(
    `<h3>${campground.title}</h3> <p>${campground.location}</p>`
  )
)
.addTo(map);