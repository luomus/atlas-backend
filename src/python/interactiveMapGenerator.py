import json
import sys
import geopandas as gpd
import folium
import pandas as pd
from tqdm import tqdm

def find_grid(grid, ykj_n, ykj_e):
    if grid["coordinates"] == f"{ykj_n}:{ykj_e}":
      return True
    
    return False
    
def get_bird_atlas_data(ykj_ns, ykj_es):
    # Loop over all ykj_n and ykj_e values and fetch data from API. Store "atlasClassSum" and "coordinates" to a table
    bird_api_data = pd.DataFrame()
    idx = 0

    with open('data/data.json') as jsonfile:
      data = json.load(jsonfile)

      for ykj_n, ykj_e in tqdm(zip(ykj_ns, ykj_es)):
          grid = list(filter(lambda x: find_grid(x, ykj_n, ykj_e), data))

          if len(grid) == 1:
            bird_api_data.at[idx, "Pesimävarmuussumma"] = int(grid[0]["atlasClassSum"])
            bird_api_data.at[idx, "YKJ"] = grid[0]["coordinates"]
            bird_api_data.at[idx, "Selvitysaste"] = grid[0]["activityCategory"]
            idx += 1
  
    return bird_api_data

def get_color(value):
    selvitysaste = value["Selvitysaste"]
    priorisoitu = value["Priorisoitu"]
    if selvitysaste in ['Hyvä', 'Erinomainen', 'Tyydyttävä']:
       return "blue"
    elif selvitysaste in ['Välttävä', "Satunnaishavaintoja", "Ei havaintoja"] and priorisoitu == "kyllä":
       return "red"
    elif selvitysaste in ['Välttävä', "Satunnaishavaintoja", "Ei havaintoja"]:
       return "gray"
    else:
       return None

def is_done(group):
    # Return true if more than 75% of the group has "Selvitysaste" good enough
    count = group["Selvitysaste"].isin(["Erinomainen", "Hyvä", "Tyydyttävä"]).sum()
    return count / len(group) > 0.75


grid_10km = gpd.read_file("data/YKJ10000_polygons.gpkg").to_crs(4326)
grid_50km_borders = gpd.read_file("data/suurruudut_borders.gpkg").to_crs(4326)

# Load Excel data
excel_data = pd.read_csv("data/Suurruudut2025.csv", sep=";")


# Fetch API data
ykj_ns = excel_data["YKJ-N"]
ykj_es = excel_data["YKJ-E"]

bird_api_data = get_bird_atlas_data(ykj_ns, ykj_es)

if bird_api_data is None:
  sys.stdout.flush()
  sys.exit(1)

# Merge Excel & API data based on grid ID
merged_data = grid_10km.merge(excel_data, on="YKJ").merge(bird_api_data, on="YKJ")

# Convert URLs to links
merged_data["url"] = merged_data["url"].apply(lambda x: f'<a href="{x}">{x}</a>')

# Find large squares that are done
done_squares = merged_data.groupby("Suurruutu").filter(is_done)["Suurruutu"].unique()

# Add a new column to indicate if a square is done
merged_data["Suurruutu saavutettu"] = merged_data["Suurruutu"].apply(lambda x: "Kyllä" if x in done_squares else "Ei")

# Create a folium map
m = folium.Map(location=[68.5, 26], zoom_start=7, control_scale=True)

# Add interactive grid with clickable urls and cool colours
folium.GeoJson(
    merged_data,
    name="10km YKJ Ruudukko",
    tooltip=folium.GeoJsonTooltip(
      fields=["YKJ", "Kunta", "Ruutu", "Pesimävarmuussumma", "Selvitysaste", "Suurruutu", "Suurruutu saavutettu"],
      style="font-size: 14px;"
    ),
    style_function=lambda x: {"color": get_color(x["properties"] if x["properties"]["Suurruutu"] not in done_squares else "black"),
        "weight": 1 
    },
    highlight_function=lambda x: {
        "weight": 5,
        "color": "black"
    },
    popup=folium.GeoJsonPopup(
        fields=["url"],
        aliases=["Lue lisää:"],
        parse_html=True,
        max_width=900
    )
).add_to(m)

# Add grid_50km_borders to the map with bolder borders
folium.GeoJson(
    grid_50km_borders,
    name="50km Grid Borders",
    style_function=lambda x: {
        "color": "black",
        "weight": 3,
        "fillOpacity": 0.5
    }
).add_to(m)

# Add square numbers as a text
for _, row in grid_50km_borders.iterrows():
    centroid = row.geometry.centroid
    lat, lon = centroid.y, centroid.x  # Extract centroid coordinates

    folium.Marker(
        location=[lat, lon],
        icon=folium.DivIcon(
            html=f"<div style='font-size: 14px; color: black; font-weight: bold;'>{row['suurruutu']}</div>"
        )
    ).add_to(m)

html_text = """
<div style="
    position: fixed; 
    bottom: 20px; right: 10px; width: 150px; height: 50px;
    background-color: white; z-index:9999; font-size:8px;
    padding: 10px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.3);">
    YKJ-ruudukko: Luomus<br>
    Taustakartta: OpenStreetMap<br>
    Tekijä: Alpo Turunen / Luomus
</div>
"""

# Add info text box
m.get_root().html.add_child(folium.Element(html_text))

# Add legend and other things
m.add_child(folium.LayerControl(draggable=True))

# Save as HTML
print(m.get_root().render())
sys.stdout.flush()