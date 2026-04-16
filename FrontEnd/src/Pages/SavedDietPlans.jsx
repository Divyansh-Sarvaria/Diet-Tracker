import { useEffect, useState } from "react";
import Card from "../Components/Cards";
export default function SavedDietPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        "https://diet-tracker-tbn5.onrender.com/diet/all",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>📋 Saved Diet Plans</h3>

      {plans.length === 0 ? (
        <p>No plans found</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {plans.map((plan) => (
            <Card key={plan._id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
