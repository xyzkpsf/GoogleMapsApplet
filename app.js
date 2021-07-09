let FAClient;
let customerDB = [];
// var geocoder;
// var map;
let currCustomer = None;

// add a function that once trigger, return the reference of a customer

// Need to handle nondefine
const SERVICE = {
  name: "FreeAgentService",
  appletId: `aHR0cHM6Ly94eXprcHNmLmdpdGh1Yi5pby9Hb29nbGVNYXBzQXBwbGV0`,
};

FAClient = new FAAppletClient({
  appletId: SERVICE.appletId,
});

FAClient.listEntityValues(
  {
    entity: "customers",
  },
  (data) => {
    storeData(data);
    console.log(customerDB);
  }
);

// const interval = 750;
//     console.log(customerDB);
//     if (customerDB.length > 0) {
//       customerDB.forEach((customer, index) => {
//         setTimeout(() => {
//           geocodeAddress(geocoder, map, customer);
//         }, index * interval);
//       });
//     }

FAClient.on("showLocation", (data) => {
  let { record } = data;
  console.log(record);
  console.log(data);
  currCustomer = parseData(record);
  console.log(currCustomer);
});

// FAClient.on("synccustomer", (data) => {
//   currCustomer = parseData(data);
//   if (!customerDB.includes(currCustomer)) {
//     customerDB.push(currCustomer);
//   }
//   console.log("sysn: ", customerDB);
// });

// FAClient.on("updatecustomer", (data) => {
//   let {
//     record: {
//       field_values: {
//         seq_id: { id },
//         customers_field4: { value: address },
//       },
//     },
//   } = data;
//   // search the customer by id then update the field
//   customerDB.forEach((element) => {
//     if (element.id == id) {
//       element.address = address;
//     }
//   });
//   console.log("Update: ", customerDB);
// });

const search = () => {
  console.log(customerDB);
  let keyName = document.getElementById("search_bar").value.split(/[ ,]+/);
  if (keyName.length > 0) {
    let resultCustomer = customerDB.filter((customer) => {
      let { fName, lName } = customer;
      return keyName.includes(fName) || keyName.includes(lName);
    });
  }
  console.log(resultCustomer);
};

document.getElementById("search_button").addEventListener("click", search);
document
  .getElementById("search_bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      search();
    }
  });

const parseData = (data) => {
  let {
    id,
    field_values: {
      customers_field0: { value: fName },
      customers_field1: { value: lName },
      customers_field2: { value: company },
      customers_field5: { value: phone },
      customers_field4: { value: address },
    },
  } = data;
  return { id, fName, lName, company, phone, address };
};

const storeData = (data) => {
  customerDB = data.map((record) => {
    return parseData(record);
  });
};

// function initMap() {
//   //geocoder = new google.maps.Geocoder();
//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 12,
//     center: { lat: 37.7749, lng: -122.4194 },
//   });
//   const interval = 750;
//   console.log(customerDB);
//   customerDB.forEach((customer, index) => {
//     setTimeout(() => {
//       geocodeAddress(geocoder, map, customer);
//     }, index * interval);
//   });
// }

// function geocodeAddress(geocoder, resultsMap, customer) {
//   console.log(customer.fName, customer.lName);
//   geocoder
//     .geocode({ address: customer.address })
//     .then(({ results }) => {
//       resultsMap.setCenter(results[0].geometry.location);
//       let marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location,
//       });
//       google.maps.event.addListener(marker, "click", () => {
//         FAClient.navigateTo(`/customers/view/${customer.id}`);
//       });
//       google.maps.event.addListener(marker, "mouseover", () => {
//         document.getElementById(
//           "info"
//         ).textContent = `${customer.fName} ${customer.lName}, ${customer.company}, ${customer.phone}
//         ${customer.address}`;
//         let element = document.getElementsByClassName("customer_info");
//         element[0].classList.add("show");
//       });
//       google.maps.event.addListener(marker, "mouseout", () => {
//         let element = document.getElementsByClassName("customer_info");
//         element[0].classList.remove("show");
//       });
//     })
//     .catch((e) =>
//       alert("Geocode was not successful for the following reason: " + e)
//     );
// }

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 37.7749, lng: -122.4194 },
  });
  const geocoder = new google.maps.Geocoder();
  if (currCustomer) {
    console.log(currCustomer);
    geocodeAddress(geocoder, map, currCustomer);
  }
}

function geocodeAddress(geocoder, resultsMap, customer) {
  geocoder
    .geocode({ address: customer.address })
    .then(({ results }) => {
      resultsMap.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
      google.maps.event.addListener(marker, "click", () => {
        FAClient.navigateTo(`/customers/view/${customer.id}`);
      });
      google.maps.event.addListener(marker, "mouseover", () => {
        document.getElementById(
          "info"
        ).textContent = `${customer.fName} ${customer.lName}, ${customer.company}, ${customer.phone}
        ${customer.address}`;
        let element = document.getElementsByClassName("customer_info");
        element[0].classList.add("show");
      });
      google.maps.event.addListener(marker, "mouseout", () => {
        let element = document.getElementsByClassName("customer_info");
        element[0].classList.remove("show");
      });
    })
    .catch((e) =>
      alert("Geocode was not successful for the following reason: " + e)
    );
}
