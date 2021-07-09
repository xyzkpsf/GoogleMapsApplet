let FAClient;
let customerDB = [];
let currCustomer;
let map;
let geocoder;

const SERVICE = {
  name: "FreeAgentService",
  appletId: `aHR0cHM6Ly94eXprcHNmLmdpdGh1Yi5pby9Hb29nbGVNYXBzQXBwbGV0`,
};

FAClient = new FAAppletClient({
  appletId: SERVICE.appletId,
});

FAClient.on("showLocation", (data) => {
  let { record } = data;
  currCustomer = parseData(record);
});

const search = () => {
  console.log(customerDB);
  let keyName = document.getElementById("search_bar").value.split(/[ ,]+/);
  console.log(keyName);
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

// const storeData = (data) => {
//   customerDB = data.map((record) => {
//     return parseData(record);
//   });
// };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 37.7749, lng: -122.4194 },
  });
  geocoder = new google.maps.Geocoder();
  const interval = 750;
  console.log(customerDB);
  customerDB.forEach((customer, index) => {
    setTimeout(() => {
      geocodeAddress(geocoder, map, customer.id);
    }, index * interval);
  });
}

function geocodeAddress(geocoder, resultsMap, customer_id) {
  //
  let customer = customerDB.filter((element) => element.id == customer_id);
  customer = customer[0];
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

const setupData = (data) => {
  customerDB = data.map((record) => {
    return parseData(record);
  });
  console.log(customerDB);
};

const syncData = () => {
  console.log("sync data");
  FAClient.listEntityValues(
    {
      entity: "customers",
    },
    (data) => {
      console.log(data);
      setupData(data);
    }
  );
};

document.getElementById("sync_button").addEventListener("click", syncData);
