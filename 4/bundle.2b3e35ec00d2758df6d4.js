(()=>{"use strict";class e{getTemplate(){return'\n      <form class="trip-filters">\n        <div class="trip-filters__filter">\n          <input id="filter-everything" type="radio" name="trip-filter" checked>\n          <label for="filter-everything">Everything</label>\n        </div>\n        <div class="trip-filters__filter">\n          <input id="filter-future" type="radio" name="trip-filter">\n          <label for="filter-future">Future</label>\n        </div>\n        <div class="trip-filters__filter">\n          <input id="filter-present" type="radio" name="trip-filter">\n          <label for="filter-present">Present</label>\n        </div>\n        <div class="trip-filters__filter">\n          <input id="filter-past" type="radio" name="trip-filter">\n          <label for="filter-past">Past</label>\n        </div>\n      </form>\n    '}render(e){e.insertAdjacentHTML("beforeend",this.getTemplate())}}class t{getTemplate(){return'\n      <div class="trip-sort">\n        <div class="trip-sort__item">\n          <input id="sort-day" type="radio" name="trip-sort" checked>\n          <label for="sort-day">Day</label>\n        </div>\n        <div class="trip-sort__item">\n          <input id="sort-price" type="radio" name="trip-sort">\n          <label for="sort-price">Price</label>\n        </div>\n      </div>\n    '}render(e){e.insertAdjacentHTML("beforeend",this.getTemplate())}}class i{constructor(e,t,i){this.point=e,this.destination=t.find((t=>t.id===e.destination)),this.offers=i[e.type]?.filter((t=>e.offers.includes(t.id)))}#e(e){return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}#t(e,t){const i=t-e,n=Math.floor(i/6e4);return n<60?`${n}M`:`${Math.floor(n/60)}H ${n%60}M`}getTemplate(){const{type:e,dateFrom:t,dateTo:i,basePrice:n}=this.point;return`\n      <li class="trip-events__item">\n        <div class="event">\n          <div class="event__type">\n            <img class="event__type-icon" width="42" height="42" src="img/icons/${e}.png" alt="Event type icon">\n          </div>\n          <h3 class="event__title">${e} ${this.destination?.name||""}</h3>\n          <div class="event__schedule">\n            <p class="event__time">\n              <time class="event__start-time">${this.#e(t)}</time>\n              &mdash;\n              <time class="event__end-time">${this.#e(i)}</time>\n            </p>\n            <p class="event__duration">${this.#t(t,i)}</p>\n          </div>\n          <p class="event__price">\n            &euro;&nbsp;<span class="event__price-value">${n}</span>\n          </p>\n          ${this.offers?.length?`\n            <h4 class="visually-hidden">Offers:</h4>\n            <ul class="event__selected-offers">\n              ${this.offers.map((e=>`\n                <li class="event__offer">\n                  <span class="event__offer-title">${e.title}</span>\n                  &plus;&euro;&nbsp;<span class="event__offer-price">${e.price}</span>\n                </li>\n              `)).join("")}\n            </ul>\n          `:""}\n          <button class="event__rollup-btn" type="button">\n            <span class="visually-hidden">Open event</span>\n          </button>\n        </div>\n      </li>\n    `}render(e){e.insertAdjacentHTML("beforeend",this.getTemplate())}}class n{constructor(e,t,i,n,s,r,a,l){this.id=e,this.type=t,this.destination=i,this.dateFrom=n,this.dateTo=s,this.basePrice=r,this.offers=a,this.isFavorite=l}}const s=[{id:"d1",name:"Amsterdam",description:"Amsterdam, capital of the Netherlands",pictures:[]},{id:"d2",name:"Chamonix",description:"Chamonix, a resort area near Mont Blanc",pictures:[]},{id:"d3",name:"Geneva",description:"Geneva, Swiss city on Lake Geneva",pictures:[]}];class r{constructor(){this.destinations=s,this.offers={taxi:[{id:"taxi1",title:"Order Uber",price:20}],flight:[{id:"flight1",title:"Add luggage",price:50},{id:"flight2",title:"Switch to comfort",price:80}],drive:[{id:"drive1",title:"Rent a car",price:200}],"check-in":[{id:"checkin1",title:"Add breakfast",price:50}]},this.points=(this.destinations,[new n("p1","taxi","d1",new Date("2024-03-18T10:30:00"),new Date("2024-03-18T11:00:00"),20,["taxi1"],!1),new n("p2","flight","d2",new Date("2024-03-18T12:25:00"),new Date("2024-03-18T13:35:00"),160,["flight1","flight2"],!1),new n("p3","drive","d2",new Date("2024-03-18T14:30:00"),new Date("2024-03-18T16:05:00"),160,["drive1"],!1),new n("p4","check-in","d2",new Date("2024-03-18T16:20:00"),new Date("2024-03-18T17:00:00"),600,["checkin1"],!1)])}getDestinations(){return this.destinations}getOffers(){return this.offers}getPoints(){return this.points}}class a{constructor(){this.model=new r,this.listContainer=null}init(){this.renderFilters(),this.renderSort(),this.renderList(),this.renderPoints()}renderFilters(){(new e).render(document.querySelector(".trip-controls__filters"))}renderSort(){(new t).render(document.querySelector(".trip-events"))}renderList(){const e=document.querySelector(".trip-events"),t=document.createElement("ul");t.classList.add("trip-events__list"),e.appendChild(t),this.listContainer=t}renderPoints(){const e=this.model.getPoints(),t=this.model.getDestinations(),n=this.model.getOffers();e.forEach((e=>{new i(e,t,n).render(this.listContainer)}))}}document.addEventListener("DOMContentLoaded",(()=>{(new a).init()}))})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWVMLEtBQUtnRCxNQUFNSixrQkFDMUJ0QyxFQUFTTixLQUFLZ0QsTUFBTUgsWUFFMUJILEVBQU9vQixTQUFTMUQsSUFDZCxJQUFJRixFQUFVRSxFQUFPQyxFQUFjQyxHQUFRVCxPQUFPRyxLQUFLaUQsY0FBYyxHQUV6RSxFQ3ZDRk0sU0FBU1EsaUJBQWlCLG9CQUFvQixNQUN0QixJQUFJaEIsR0FDWkcsTUFBTSxHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmlnLXRyaXAvLi9zcmMvdmlldy9maWx0ZXJzLXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmlnLXRyaXAvLi9zcmMvdmlldy9zb3J0LXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmlnLXRyaXAvLi9zcmMvdmlldy9wb2ludC12aWV3LmpzIiwid2VicGFjazovL2JpZy10cmlwLy4vc3JjL21vZGVsL3BvaW50LmpzIiwid2VicGFjazovL2JpZy10cmlwLy4vc3JjL21vY2svbW9jay5qcyIsIndlYnBhY2s6Ly9iaWctdHJpcC8uL3NyYy9tb2RlbC9tb2RlbC5qcyIsIndlYnBhY2s6Ly9iaWctdHJpcC8uL3NyYy9wcmVzZW50ZXIvdHJpcC1wcmVzZW50ZXIuanMiLCJ3ZWJwYWNrOi8vYmlnLXRyaXAvLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBGaWx0ZXJzVmlldyB7XG4gIGdldFRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8Zm9ybSBjbGFzcz1cInRyaXAtZmlsdGVyc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidHJpcC1maWx0ZXJzX19maWx0ZXJcIj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJmaWx0ZXItZXZlcnl0aGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJ0cmlwLWZpbHRlclwiIGNoZWNrZWQ+XG4gICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRlci1ldmVyeXRoaW5nXCI+RXZlcnl0aGluZzwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidHJpcC1maWx0ZXJzX19maWx0ZXJcIj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJmaWx0ZXItZnV0dXJlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cInRyaXAtZmlsdGVyXCI+XG4gICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRlci1mdXR1cmVcIj5GdXR1cmU8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRyaXAtZmlsdGVyc19fZmlsdGVyXCI+XG4gICAgICAgICAgPGlucHV0IGlkPVwiZmlsdGVyLXByZXNlbnRcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHJpcC1maWx0ZXJcIj5cbiAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlsdGVyLXByZXNlbnRcIj5QcmVzZW50PC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0cmlwLWZpbHRlcnNfX2ZpbHRlclwiPlxuICAgICAgICAgIDxpbnB1dCBpZD1cImZpbHRlci1wYXN0XCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cInRyaXAtZmlsdGVyXCI+XG4gICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRlci1wYXN0XCI+UGFzdDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgIGA7XG4gIH1cblxuICByZW5kZXIoY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy5nZXRUZW1wbGF0ZSgpKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ydFZpZXcge1xuICBnZXRUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYFxuICAgICAgPGRpdiBjbGFzcz1cInRyaXAtc29ydFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidHJpcC1zb3J0X19pdGVtXCI+XG4gICAgICAgICAgPGlucHV0IGlkPVwic29ydC1kYXlcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHJpcC1zb3J0XCIgY2hlY2tlZD5cbiAgICAgICAgICA8bGFiZWwgZm9yPVwic29ydC1kYXlcIj5EYXk8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRyaXAtc29ydF9faXRlbVwiPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInNvcnQtcHJpY2VcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHJpcC1zb3J0XCI+XG4gICAgICAgICAgPGxhYmVsIGZvcj1cInNvcnQtcHJpY2VcIj5QcmljZTwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcbiAgfVxuXG4gIHJlbmRlcihjb250YWluZXIpIHtcbiAgICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLmdldFRlbXBsYXRlKCkpO1xuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50VmlldyB7XG4gIGNvbnN0cnVjdG9yKHBvaW50LCBkZXN0aW5hdGlvbnMsIG9mZmVycykge1xuICAgIHRoaXMucG9pbnQgPSBwb2ludDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25zLmZpbmQoKGQpID0+IGQuaWQgPT09IHBvaW50LmRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLm9mZmVycyA9IG9mZmVyc1twb2ludC50eXBlXT8uZmlsdGVyKChvKSA9PiBwb2ludC5vZmZlcnMuaW5jbHVkZXMoby5pZCkpO1xuICB9XG5cbiAgI2Zvcm1hdERhdGUoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pO1xuICB9XG5cbiAgI2dldER1cmF0aW9uKGRhdGVGcm9tLCBkYXRlVG8pIHtcbiAgICBjb25zdCBkaWZmID0gZGF0ZVRvIC0gZGF0ZUZyb207XG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoZGlmZiAvIDYwMDAwKTtcbiAgICBpZiAobWludXRlcyA8IDYwKSB7XG4gICAgICByZXR1cm4gYCR7bWludXRlc31NYDtcbiAgICB9XG4gICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgY29uc3QgcmVtYWluaW5nTWludXRlcyA9IG1pbnV0ZXMgJSA2MDtcbiAgICByZXR1cm4gYCR7aG91cnN9SCAke3JlbWFpbmluZ01pbnV0ZXN9TWA7XG4gIH1cblxuICBnZXRUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7dHlwZSwgZGF0ZUZyb20sIGRhdGVUbywgYmFzZVByaWNlfSA9IHRoaXMucG9pbnQ7XG5cbiAgICByZXR1cm4gYFxuICAgICAgPGxpIGNsYXNzPVwidHJpcC1ldmVudHNfX2l0ZW1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50X190eXBlXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwiZXZlbnRfX3R5cGUtaWNvblwiIHdpZHRoPVwiNDJcIiBoZWlnaHQ9XCI0MlwiIHNyYz1cImltZy9pY29ucy8ke3R5cGV9LnBuZ1wiIGFsdD1cIkV2ZW50IHR5cGUgaWNvblwiPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMyBjbGFzcz1cImV2ZW50X190aXRsZVwiPiR7dHlwZX0gJHt0aGlzLmRlc3RpbmF0aW9uPy5uYW1lIHx8ICcnfTwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50X19zY2hlZHVsZVwiPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJldmVudF9fdGltZVwiPlxuICAgICAgICAgICAgICA8dGltZSBjbGFzcz1cImV2ZW50X19zdGFydC10aW1lXCI+JHt0aGlzLiNmb3JtYXREYXRlKGRhdGVGcm9tKX08L3RpbWU+XG4gICAgICAgICAgICAgICZtZGFzaDtcbiAgICAgICAgICAgICAgPHRpbWUgY2xhc3M9XCJldmVudF9fZW5kLXRpbWVcIj4ke3RoaXMuI2Zvcm1hdERhdGUoZGF0ZVRvKX08L3RpbWU+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImV2ZW50X19kdXJhdGlvblwiPiR7dGhpcy4jZ2V0RHVyYXRpb24oZGF0ZUZyb20sIGRhdGVUbyl9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzPVwiZXZlbnRfX3ByaWNlXCI+XG4gICAgICAgICAgICAmZXVybzsmbmJzcDs8c3BhbiBjbGFzcz1cImV2ZW50X19wcmljZS12YWx1ZVwiPiR7YmFzZVByaWNlfTwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgJHt0aGlzLm9mZmVycz8ubGVuZ3RoID8gYFxuICAgICAgICAgICAgPGg0IGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+T2ZmZXJzOjwvaDQ+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJldmVudF9fc2VsZWN0ZWQtb2ZmZXJzXCI+XG4gICAgICAgICAgICAgICR7dGhpcy5vZmZlcnMubWFwKChvZmZlcikgPT4gYFxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV2ZW50X19vZmZlclwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJldmVudF9fb2ZmZXItdGl0bGVcIj4ke29mZmVyLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICZwbHVzOyZldXJvOyZuYnNwOzxzcGFuIGNsYXNzPVwiZXZlbnRfX29mZmVyLXByaWNlXCI+JHtvZmZlci5wcmljZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgYCkuam9pbignJyl9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIGAgOiAnJ31cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZXZlbnRfX3JvbGx1cC1idG5cIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPk9wZW4gZXZlbnQ8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICBgO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMuZ2V0VGVtcGxhdGUoKSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50IHtcbiAgY29uc3RydWN0b3IoaWQsIHR5cGUsIGRlc3RpbmF0aW9uLCBkYXRlRnJvbSwgZGF0ZVRvLCBiYXNlUHJpY2UsIG9mZmVycywgaXNGYXZvcml0ZSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB0aGlzLmRhdGVGcm9tID0gZGF0ZUZyb207XG4gICAgdGhpcy5kYXRlVG8gPSBkYXRlVG87XG4gICAgdGhpcy5iYXNlUHJpY2UgPSBiYXNlUHJpY2U7XG4gICAgdGhpcy5vZmZlcnMgPSBvZmZlcnM7XG4gICAgdGhpcy5pc0Zhdm9yaXRlID0gaXNGYXZvcml0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IFBvaW50IGZyb20gJy4uL21vZGVsL3BvaW50LmpzJztcblxuY29uc3QgREVTVElOQVRJT05TID0gW1xuICB7XG4gICAgaWQ6ICdkMScsXG4gICAgbmFtZTogJ0Ftc3RlcmRhbScsXG4gICAgZGVzY3JpcHRpb246ICdBbXN0ZXJkYW0sIGNhcGl0YWwgb2YgdGhlIE5ldGhlcmxhbmRzJyxcbiAgICBwaWN0dXJlczogW11cbiAgfSxcbiAge1xuICAgIGlkOiAnZDInLFxuICAgIG5hbWU6ICdDaGFtb25peCcsXG4gICAgZGVzY3JpcHRpb246ICdDaGFtb25peCwgYSByZXNvcnQgYXJlYSBuZWFyIE1vbnQgQmxhbmMnLFxuICAgIHBpY3R1cmVzOiBbXVxuICB9LFxuICB7XG4gICAgaWQ6ICdkMycsXG4gICAgbmFtZTogJ0dlbmV2YScsXG4gICAgZGVzY3JpcHRpb246ICdHZW5ldmEsIFN3aXNzIGNpdHkgb24gTGFrZSBHZW5ldmEnLFxuICAgIHBpY3R1cmVzOiBbXVxuICB9XG5dO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVEZXN0aW5hdGlvbnMgPSAoKSA9PiBERVNUSU5BVElPTlM7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZU9mZmVycyA9ICgpID0+ICh7XG4gIHRheGk6IFtcbiAgICB7aWQ6ICd0YXhpMScsIHRpdGxlOiAnT3JkZXIgVWJlcicsIHByaWNlOiAyMH1cbiAgXSxcbiAgZmxpZ2h0OiBbXG4gICAge2lkOiAnZmxpZ2h0MScsIHRpdGxlOiAnQWRkIGx1Z2dhZ2UnLCBwcmljZTogNTB9LFxuICAgIHtpZDogJ2ZsaWdodDInLCB0aXRsZTogJ1N3aXRjaCB0byBjb21mb3J0JywgcHJpY2U6IDgwfVxuICBdLFxuICBkcml2ZTogW1xuICAgIHtpZDogJ2RyaXZlMScsIHRpdGxlOiAnUmVudCBhIGNhcicsIHByaWNlOiAyMDB9XG4gIF0sXG4gICdjaGVjay1pbic6IFtcbiAgICB7aWQ6ICdjaGVja2luMScsIHRpdGxlOiAnQWRkIGJyZWFrZmFzdCcsIHByaWNlOiA1MH1cbiAgXVxufSk7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVBvaW50cyA9ICgpID0+IFtcbiAgbmV3IFBvaW50KFxuICAgICdwMScsXG4gICAgJ3RheGknLFxuICAgICdkMScsXG4gICAgbmV3IERhdGUoJzIwMjQtMDMtMThUMTA6MzA6MDAnKSxcbiAgICBuZXcgRGF0ZSgnMjAyNC0wMy0xOFQxMTowMDowMCcpLFxuICAgIDIwLFxuICAgIFsndGF4aTEnXSxcbiAgICBmYWxzZVxuICApLFxuICBuZXcgUG9pbnQoXG4gICAgJ3AyJyxcbiAgICAnZmxpZ2h0JyxcbiAgICAnZDInLFxuICAgIG5ldyBEYXRlKCcyMDI0LTAzLTE4VDEyOjI1OjAwJyksXG4gICAgbmV3IERhdGUoJzIwMjQtMDMtMThUMTM6MzU6MDAnKSxcbiAgICAxNjAsXG4gICAgWydmbGlnaHQxJywgJ2ZsaWdodDInXSxcbiAgICBmYWxzZVxuICApLFxuICBuZXcgUG9pbnQoXG4gICAgJ3AzJyxcbiAgICAnZHJpdmUnLFxuICAgICdkMicsXG4gICAgbmV3IERhdGUoJzIwMjQtMDMtMThUMTQ6MzA6MDAnKSxcbiAgICBuZXcgRGF0ZSgnMjAyNC0wMy0xOFQxNjowNTowMCcpLFxuICAgIDE2MCxcbiAgICBbJ2RyaXZlMSddLFxuICAgIGZhbHNlXG4gICksXG4gIG5ldyBQb2ludChcbiAgICAncDQnLFxuICAgICdjaGVjay1pbicsXG4gICAgJ2QyJyxcbiAgICBuZXcgRGF0ZSgnMjAyNC0wMy0xOFQxNjoyMDowMCcpLFxuICAgIG5ldyBEYXRlKCcyMDI0LTAzLTE4VDE3OjAwOjAwJyksXG4gICAgNjAwLFxuICAgIFsnY2hlY2tpbjEnXSxcbiAgICBmYWxzZVxuICApXG5dO1xuIiwiaW1wb3J0IHtnZW5lcmF0ZURlc3RpbmF0aW9ucywgZ2VuZXJhdGVPZmZlcnMsIGdlbmVyYXRlUG9pbnRzfSBmcm9tICcuLi9tb2NrL21vY2suanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVzdGluYXRpb25zID0gZ2VuZXJhdGVEZXN0aW5hdGlvbnMoKTtcbiAgICB0aGlzLm9mZmVycyA9IGdlbmVyYXRlT2ZmZXJzKCk7XG4gICAgdGhpcy5wb2ludHMgPSBnZW5lcmF0ZVBvaW50cyh0aGlzLmRlc3RpbmF0aW9ucyk7XG4gIH1cblxuICBnZXREZXN0aW5hdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb25zO1xuICB9XG5cbiAgZ2V0T2ZmZXJzKCkge1xuICAgIHJldHVybiB0aGlzLm9mZmVycztcbiAgfVxuXG4gIGdldFBvaW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHM7XG4gIH1cbn1cbiIsImltcG9ydCBGaWx0ZXJzVmlldyBmcm9tICcuLi92aWV3L2ZpbHRlcnMtdmlldy5qcyc7XG5pbXBvcnQgU29ydFZpZXcgZnJvbSAnLi4vdmlldy9zb3J0LXZpZXcuanMnO1xuaW1wb3J0IFBvaW50VmlldyBmcm9tICcuLi92aWV3L3BvaW50LXZpZXcuanMnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL21vZGVsL21vZGVsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJpcFByZXNlbnRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoKTtcbiAgICB0aGlzLmxpc3RDb250YWluZXIgPSBudWxsO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlbmRlckZpbHRlcnMoKTtcbiAgICB0aGlzLnJlbmRlclNvcnQoKTtcbiAgICB0aGlzLnJlbmRlckxpc3QoKTtcbiAgICB0aGlzLnJlbmRlclBvaW50cygpO1xuICB9XG5cbiAgcmVuZGVyRmlsdGVycygpIHtcbiAgICBuZXcgRmlsdGVyc1ZpZXcoKS5yZW5kZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyaXAtY29udHJvbHNfX2ZpbHRlcnMnKSk7XG4gIH1cblxuICByZW5kZXJTb3J0KCkge1xuICAgIG5ldyBTb3J0VmlldygpLnJlbmRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJpcC1ldmVudHMnKSk7XG4gIH1cblxuICByZW5kZXJMaXN0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50cmlwLWV2ZW50cycpO1xuICAgIGNvbnN0IGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBsaXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0cmlwLWV2ZW50c19fbGlzdCcpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaXN0RWxlbWVudCk7XG4gICAgdGhpcy5saXN0Q29udGFpbmVyID0gbGlzdEVsZW1lbnQ7XG4gIH1cblxuICByZW5kZXJQb2ludHMoKSB7XG4gICAgY29uc3QgcG9pbnRzID0gdGhpcy5tb2RlbC5nZXRQb2ludHMoKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbnMgPSB0aGlzLm1vZGVsLmdldERlc3RpbmF0aW9ucygpO1xuICAgIGNvbnN0IG9mZmVycyA9IHRoaXMubW9kZWwuZ2V0T2ZmZXJzKCk7XG5cbiAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcbiAgICAgIG5ldyBQb2ludFZpZXcocG9pbnQsIGRlc3RpbmF0aW9ucywgb2ZmZXJzKS5yZW5kZXIodGhpcy5saXN0Q29udGFpbmVyKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiXG5pbXBvcnQgVHJpcFByZXNlbnRlciBmcm9tICcuL3ByZXNlbnRlci90cmlwLXByZXNlbnRlci5qcyc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IHRyaXBQcmVzZW50ZXIgPSBuZXcgVHJpcFByZXNlbnRlcigpO1xuICB0cmlwUHJlc2VudGVyLmluaXQoKTtcbn0pO1xuIl0sIm5hbWVzIjpbIkZpbHRlcnNWaWV3IiwiZ2V0VGVtcGxhdGUiLCJyZW5kZXIiLCJjb250YWluZXIiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJ0aGlzIiwiU29ydFZpZXciLCJQb2ludFZpZXciLCJjb25zdHJ1Y3RvciIsInBvaW50IiwiZGVzdGluYXRpb25zIiwib2ZmZXJzIiwiZGVzdGluYXRpb24iLCJmaW5kIiwiZCIsImlkIiwidHlwZSIsImZpbHRlciIsIm8iLCJpbmNsdWRlcyIsImRhdGUiLCJ0b0xvY2FsZVRpbWVTdHJpbmciLCJob3VyIiwibWludXRlIiwiZGF0ZUZyb20iLCJkYXRlVG8iLCJkaWZmIiwibWludXRlcyIsIk1hdGgiLCJmbG9vciIsImJhc2VQcmljZSIsIm5hbWUiLCJsZW5ndGgiLCJtYXAiLCJvZmZlciIsInRpdGxlIiwicHJpY2UiLCJqb2luIiwiUG9pbnQiLCJpc0Zhdm9yaXRlIiwiREVTVElOQVRJT05TIiwiZGVzY3JpcHRpb24iLCJwaWN0dXJlcyIsIk1vZGVsIiwidGF4aSIsImZsaWdodCIsImRyaXZlIiwicG9pbnRzIiwiRGF0ZSIsImdldERlc3RpbmF0aW9ucyIsImdldE9mZmVycyIsImdldFBvaW50cyIsIlRyaXBQcmVzZW50ZXIiLCJtb2RlbCIsImxpc3RDb250YWluZXIiLCJpbml0IiwicmVuZGVyRmlsdGVycyIsInJlbmRlclNvcnQiLCJyZW5kZXJMaXN0IiwicmVuZGVyUG9pbnRzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibGlzdEVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYXBwZW5kQ2hpbGQiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJzb3VyY2VSb290IjoiIn0=