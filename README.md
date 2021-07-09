# GoogleMapsApplet
## 1. Applet UI Outline.

![Outline](https://github.com/xyzkpsf/GoogleMapsApplet/blob/main/outline.png)

## 2. Functionality

### a. Sync Data: 

When the user press the Sync data button, it will trigger a query to get all the existing records 
from Customers App, and parse the record object onto a (trivial) format of 
```javascript
{
  id: id
  fName: customers_field0,
  lName: customers_field1,
  company: customers_field2,
  phone: customers_field5,
  address: customers_field4,
}
```
, which would be stored onto *customerDB*, which served as a virtual database, and *currentDB*, which served as memory.

### b. Draw Markers and Navigate.

Each Customer's location info would be converted to a format of 
```javascript
{ Lat, Lng }
```
using Google geocoding api, and draw a marker in the corresponding location. When a user hover a marker, the detail
of the customer object will be shown. Or when a user click on a marker, it will navigate to the detail record of 
the customer within freeagent.

The markers only exists if a record has the location/address field, and both the total number of results with and without location field will be displayed.

### c. Search.

The search support fuzzy search. If one of the first name or last name matches the user's input, then the corresponing marker
would be keep, and thoses unmatched record's marker would be delete. 
The search result would be keep tracked by the *currentDB*.
Hence User could search again since all the records stored in *customerDB* would not changed by search.

## 3. Browser compatibility

I had tested on Chrome and Safari.
