import WaterProgress from "../Components/WaterProgressBubbles";
import "../Components/PlanDietStyle.css";
import SearchBar from "../Components/SearchBar";
import { useEffect, useState, useRef } from "react";
import Loader from "../Components/loader";

const isValidFood = (food) => {
  const fields = [food.calories, food.protein, food.carbs, food.fat];
  return fields.every((val) => {
    if (val === undefined || val === null) return true;
    return isFinite(val) && val >= 0 && val <= 10000;
  });
};

export default function PlanDiet() {
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [planName, setPlanName] = useState("");
  const handleSaveClick = () => {
    setShowModal(true);
  };

  const clickTimers = useRef({});

  const [selectedFoods, setSelectedFoods] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedFoods");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const total = selectedFoods.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    setTotals({
      calories: Math.round(total.calories),
      protein: Math.round(total.protein),
      carbs: Math.round(total.carbs),
      fat: Math.round(total.fat),
    });
  }, [selectedFoods]);

  useEffect(() => {
    localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));
  }, [selectedFoods]);
  const getPercent = (value, maxValue) => {
    const percent = (value / maxValue) * 100;
    return Math.min(Math.round(percent), 100);
  };
  const foodList = [
    "chicken",
    "apple",
    "egg",
    "milk",
    "bread",
    "banana",
    "paneer",
  ];
  const [randomFood] = useState(
    foodList[Math.floor(Math.random() * foodList.length)],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/nutrition?query=${query || randomFood}&page=${page}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        },
      );
      const data = await res.json();
      const filtered = data.foods
        .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
        .filter(isValidFood);

      setFoods((prev) => {
        const combined = [...prev, ...filtered];
        return combined.filter(
          (item, index, self) =>
            index === self.findIndex((f) => f.name === item.name),
        );
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [page, query]);

  // ✅ Each added food gets a unique uid so duplicates are tracked separately
  const addFoodEntry = (food, count = 1) => {
    const entries = Array.from({ length: count }, () => ({
      ...food,
      uid: crypto.randomUUID(),
    }));
    setSelectedFoods((prev) => [...prev, ...entries]);
  };

  // ✅ Remove one specific instance by uid
  const removeByUid = (uid) => {
    setSelectedFoods((prev) => prev.filter((f) => f.uid !== uid));
  };

  // ✅ Single click = add 1, double click = add 2
  // Timer prevents onClick from firing on double-click
  const handleCardClick = (food) => {
    if (clickTimers.current[food.id]) {
      // Second click within 250ms → double-click, add 2
      clearTimeout(clickTimers.current[food.id]);
      delete clickTimers.current[food.id];
      addFoodEntry(food, 2);
    } else {
      // First click — wait to see if another comes
      clickTimers.current[food.id] = setTimeout(() => {
        delete clickTimers.current[food.id];
        addFoodEntry(food, 1); // confirmed single click → add 1
      }, 250);
    }
  };

  // const handleSave =

  const handleFinalSave = async () => {
    if (!planName.trim()) {
      alert("Please enter a plan name");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/diet/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: planName,
          foods: selectedFoods,
          totals,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Diet saved successfully!");

        // ✅ RESET EVERYTHING
        setSelectedFoods([]);
        setTotals({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        });

        localStorage.removeItem("selectedFoods"); // 👈 IMPORTANT

        setShowModal(false);
        setPlanName("");
      } else {
        alert("❌ Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error saving diet");
    }
  };
  const max = { calories: 2000, protein: 100, carbs: 300, fat: 70 };

  const unselectedFoods = foods.filter(
    (food) => !selectedFoods.some((s) => s.id === food.id),
  );

  // ✅ Group selected foods to show quantity badges
  const selectedGrouped = selectedFoods.reduce((acc, food) => {
    const key = food.id;
    if (!acc[key]) acc[key] = { ...food, count: 1, uids: [food.uid] };
    else {
      acc[key].count++;
      acc[key].uids.push(food.uid);
    }
    return acc;
  }, {});

  return (
    <div className="container-fluid">
      <div className="row">
        {/* LEFT PANEL */}
        <div className="nutritionPanel col-3">
          <h4 className="panelTitle">Total Nutritional Value</h4>
          <div className="progressGrid" style={{ height: "100vh" }}>
            <WaterProgress
              label={`Calories (${totals.calories} / ${max.calories})`}
              percent={getPercent(totals.calories, max.calories)}
              color="linear-gradient(180deg,#ff9966,#ff5e62)"
            />
            <WaterProgress
              label={`Protein (${totals.protein}g / ${max.protein}g)`}
              percent={getPercent(totals.protein, max.protein)}
              color="linear-gradient(180deg,#36d1dc,#5b86e5)"
            />
            <WaterProgress
              label={`Carbs (${totals.carbs}g / ${max.carbs}g)`}
              percent={getPercent(totals.carbs, max.carbs)}
              color="linear-gradient(180deg,#11998e,#38ef7d)"
            />
            <WaterProgress
              label={`Fat (${totals.fat}g / ${max.fat}g)`}
              percent={getPercent(totals.fat, max.fat)}
              color="linear-gradient(180deg,#ffcc70,#ff7b54)"
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="col-9"
          style={{ marginTop: "40px", width: "80%", position: "relative" }}
        >
          <SearchBar
            setQuery={setQuery}
            setPage={setPage}
            setFoods={setFoods}
          />

          {/* PINNED SELECTED SECTION */}
          {Object.values(selectedGrouped).length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h6
                style={{
                  fontWeight: "700",
                  color: "#38ef7d",
                  marginBottom: "10px",
                }}
              >
                ✅ Selected ({selectedFoods.length} serving
                {selectedFoods.length !== 1 ? "s" : ""})
              </h6>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {Object.values(selectedGrouped).map((group) => (
                  <div
                    key={group.id + "-selected"}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-sm selected-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5
                            className="card-title mb-0"
                            style={{ fontSize: "14px" }}
                          >
                            {group.name}
                          </h5>
                          <span style={{ fontSize: "11px", color: "#aaa" }}>
                            P: {group.protein ?? "—"}g · C: {group.carbs ?? "—"}
                            g · F: {group.fat ?? "—"}g
                          </span>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1">
                          <span className="badge bg-success rounded-pill">
                            {group.calories} cal
                          </span>
                          {/* ✅ Quantity controls — + adds one more, - removes one instance */}
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <button
                              onClick={() =>
                                removeByUid(group.uids[group.uids.length - 1])
                              }
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#ff5e62",
                                color: "#fff",
                                fontSize: "14px",
                                lineHeight: 1,
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                fontWeight: "700",
                                minWidth: "16px",
                                textAlign: "center",
                              }}
                            >
                              {group.count}
                            </span>
                            <button
                              onClick={() => addFoodEntry(group, 1)}
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#38ef7d",
                                color: "#111",
                                fontSize: "14px",
                                lineHeight: 1,
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr style={{ borderColor: "#333", margin: "20px 0" }} />
            </div>
          )}

          {/* SEARCH RESULTS */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {unselectedFoods.map((food, index) => (
              <div
                key={food.id + "-" + index}
                onClick={() => handleCardClick(food)}
                style={{ cursor: "pointer", userSelect: "none" }}
                title="Click to add · Double-click to add ×2"
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{food.name}</h5>
                    <span className="badge bg-success rounded-pill">
                      {food.calories} cal
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="loader-full">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <button
        onClick={handleSaveClick}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          padding: "12px 28px",
          borderRadius: "50px",
          border: "none",
          background: "linear-gradient(135deg, #11998e, #38ef7d)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
      >
        💾 Save Plan
      </button>
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "10px" }}>Name Your Diet Plan</h3>

            <input
              type="text"
              placeholder="e.g. Fat Loss Plan"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              style={styles.input}
            />

            <div style={styles.actions}>
              <button style={styles.cancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={styles.save} onClick={handleFinalSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  cancel: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#ccc",
    cursor: "pointer",
  },
  save: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#11998e",
    color: "#fff",
    cursor: "pointer",
  },
};
