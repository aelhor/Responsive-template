const API_KEY = 'f7197a672e73016a7688cc96bf3e3bfa' //weather api key
const ROAD_API_KEY = 'AIzaSyC2dCeOp4m274DapLn-jvj_Tj6icof0HWk'
let lon, lat, temprature , maxTemp, minTemp , humidity

let tempContainer = document.querySelector('.temprature')
let min_maxContainer = document.querySelector('.max_min')
let humidityContainer = document.querySelector('.humidity')
let mainCondtion = document.querySelector('.main_condition')
let min_maxContainerTomorrow = document.querySelector('.max_min_tomorrow')
let humidityContainerTomorrow = document.querySelector('.humidity_tomorrow')
let weatherPs = document.querySelectorAll('.weather_widget p')
let weatherWidget = document.querySelector('.weather_widget')
let routeBtn = document.querySelector('.route-btn') 

window.addEventListener('load', ()=> { 
    if(confirm('This Website needs your Location ?') == true ) { 
        navigator.geolocation.getCurrentPosition((position)=>{
            lat = position.coords.latitude        
            lon = position.coords.longitude
        })
        const getweather = async(lat, lon) => { 
            const apiCall = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
            try {
                const res =  await apiCall.json()
                console.log('Res : ', res)
                mainCondtion.innerHTML =`<img class = 'condition_icon'src =  http://openweathermap.org/img/wn/${res.daily[0].weather[0].icon}@2x.png > `
                tempContainer.innerHTML = Math.ceil( (res.daily[0].temp.day) - 273.15  )+'°C'  
                min_maxContainer.innerHTML = Math.ceil( (res.daily[0].temp.min ) - 273.15 )+'°'+'/'+ Math.ceil((res.daily[0].temp.max) - 273.15 )+'°'
                humidityContainer.innerHTML = '<i class="fas fa-umbrella weather_icon"></i>'+res.daily[0].humidity + '%'
                // tomorrow's
                humidityContainerTomorrow.innerHTML ='<i class="fas fa-umbrella weather_icon"></i> '+res.daily[1].humidity + '%'
                min_maxContainerTomorrow.innerHTML = Math.ceil( (res.daily[1].temp.min ) - 273.15 )+'°'+'/'+ Math.ceil((res.daily[1].temp.max) - 273.15 )+'°'
                weatherPs[0].innerHTML = 'Today\'s Forcast'
                weatherPs[1].innerHTML = 'Tomorrow'
        
        
            } catch (error) {
                console.log(error)
                weatherWidget.innerHTML += 'somthing went wrong..Try again '
                weatherWidget.classList.add('location_error')
            }
        } 
        setTimeout(()=> {
            getweather(lat, lon)
        }, 2000)
    }
    else{
        weatherWidget.classList.add('location_error')
        weatherWidget.innerHTML +='The website functionality wouldn\'t work perfectly without location access...let\'s retry '
    }
    
})





// https://roads.googleapis.com/v1/nearestRoads?points=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796
// routeBtn.addEventListener('click', async()=> { 
//     try {
//         const roadApi = fetch(`https://roads.googleapis.com/v1/nearestRoads?points=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796&key=${ROAD_API_KEY}`)
//         console.log('Road : ', roadApi);
//     } catch (error) {
//         console.log(error.message);
//     }
// })


initMap = async () =>{
    const uluru = { lat: 30.791733237563623, lng:  30.974249113259116 };
    let DirectionsService = new google.maps.DirectionsService
    let directionDisplay = new google.maps.DirectionsRenderer
    const map =await new google.maps.Map(document.querySelector(".map"), {
        zoom: 16,
        center: uluru,
    });
    directionDisplay.setMap(map)

    let btnClickedhandler = ()=>{
        calcAndDisplayRoute(DirectionsService, directionDisplay)
    }
    routeBtn.addEventListener('click',btnClickedhandler)
    calcAndDisplayRoute = (DirectionsService, directionDisplay)=>{
        DirectionsService.route({
            origin :  new google.maps.LatLng(30.791733237563623,  30.974249113259116), 
            destination : new google.maps.LatLng(lat, lon), 
            travelMode: google.maps.TravelMode.DRIVING
        }, function(res, status){
            if (status === 'OK'){
                directionDisplay.setDirection(res)
            }
            else{
                alert( status)
            }
        })
    }
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}


