import { useLocation, useNavigate, useParams } from "react-router";

type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  phone: string;
  photo: string;
};

export default function Details() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state as UserInfo | null;

  if (!user || user.id !== Number(id)) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">User not found</h1>

          <button
            type="button"
            onClick={() => navigate("/about")}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lg">
        <img
          src={user.photo}
          alt={`${user.firstName} ${user.lastName}`}
          className="mb-6 h-64 w-full rounded-2xl object-cover"
        />

        <h1 className="text-3xl font-bold text-slate-800">
          {user.firstName} {user.lastName}
        </h1>

        <div className="mt-5 space-y-3">
          <p><b>ID:</b> {user.id}</p>
          <p><b>Age:</b> {user.age}</p>
          <p><b>City:</b> {user.city}</p>
          <p><b>Phone:</b> {user.phone}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 rounded-lg bg-slate-700 px-4 py-2 text-white"
        >
          Back
        </button>
      </div>
    </main>
  );
}