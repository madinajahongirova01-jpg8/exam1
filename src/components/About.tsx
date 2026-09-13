import React, { useState } from "react";
import { useNavigate } from "react-router";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { create } from "zustand";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

type Extra = {
  id: number;
  city: string;
  photo: string;
  phone: string;
};

type FullUser = User & Extra;

type ZustandState = {
  data: User[];
  addUser: (user: User) => void;
  deleteUser: (id: number) => void;
  editUser: (user: User) => void;
};

type RootState = {
  users: Extra[];
};


const zustandUsers: User[] = [
  { id: 1, firstName: "Ali", lastName: "Karimov", age: 22 },
  { id: 2, firstName: "Madina", lastName: "Saidova", age: 21 },
  { id: 3, firstName: "Rustam", lastName: "Sharifov", age: 25 },
];

const reduxUsers: Extra[] = [
  {
    id: 1,
    city: "Dushanbe",
    photo: "https://i.pravatar.cc/300?img=12",
    phone: "+992 900 00 00 01",
  },
  {
    id: 2,
    city: "Khujand",
    photo: "https://i.pravatar.cc/300?img=47",
    phone: "+992 900 00 00 02",
  },
  {
    id: 3,
    city: "Bokhtar",
    photo: "https://i.pravatar.cc/300?img=11",
    phone: "+992 900 00 00 03",
  },
];

const useZustand = create<ZustandState>((set) => ({
  data: zustandUsers,

  addUser: (user) =>
    set((state) => ({
      data: [...state.data, user],
    })),

  deleteUser: (id) =>
    set((state) => ({
      data: state.data.filter((user) => user.id !== id),
    })),

  editUser: (updatedUser) =>
    set((state) => ({
      data: state.data.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),
}));

const reduxSlice = createSlice({
  name: "users",
  initialState: reduxUsers,
  reducers: {
    addExtra: (state, action) => {
      state.push(action.payload);
    },

    deleteExtra: (state, action) =>
      state.filter((user) => user.id !== action.payload),

    editExtra: (state, action) =>
      state.map((user) =>
        user.id === action.payload.id ? action.payload : user
      ),
  },
});

const reduxStore = configureStore({
  reducer: {
    users: reduxSlice.reducer,
  },
});

const { addExtra, deleteExtra, editExtra } = reduxSlice.actions;

function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxData = useSelector((state: RootState) => state.users);
  const zustandData = useZustand((state) => state.data);
  const addUser = useZustand((state) => state.addUser);
  const deleteUser = useZustand((state) => state.deleteUser);
  const editUser = useZustand((state) => state.editUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = (id: number) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((selectedId) => selectedId !== id)
      : [...prev, id]
  );
};
  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setCity("");
    setPhone("");
    setEditId(null);
    setEditOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !age ||
      !city.trim() ||
      !phone.trim()
    ) {
      return;
    }

    const id = editId ?? Date.now();

    const zustandUser: User = {
      id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number(age),
    };

    const oldExtra = reduxData.find((user) => user.id === id);

    const reduxUser: Extra = {
      id,
      city: city.trim(),
      phone: phone.trim(),
      photo: oldExtra?.photo || `https://i.pravatar.cc/300?u=${id}`,
    };

    if (editId !== null) {
      editUser(zustandUser);
      dispatch(editExtra(reduxUser));
    } else {
      addUser(zustandUser);
      dispatch(addExtra(reduxUser));
    }

    clearForm();
  };

  const handleEdit = (user: FullUser) => {
    setEditId(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAge(String(user.age));
    setCity(user.city);
    setPhone(user.phone);
    setEditOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteUser(id);
    dispatch(deleteExtra(id));

    setSelectedIds((prev) =>
      prev.filter((selectedId) => selectedId !== id)
    );
  };

 

  const data: FullUser[] = zustandData
    .map((zustandUser) => {
      const reduxUser = reduxData.find(
        (reduxUser) => reduxUser.id === zustandUser.id
      );

      if (!reduxUser) return null;

      return {
        ...zustandUser,
        ...reduxUser,
      };
    })
    .filter((user): user is FullUser => user !== null)
    .filter((user) =>
      `${user.firstName} ${user.lastName} ${user.city}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">Users</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-3 rounded-2xl bg-white p-5 shadow sm:grid-cols-2 lg:grid-cols-3"
        >
          <input
            className="rounded-lg border p-3"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}  
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Age"
            type="number"
            min="1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            
          />

          <input
            className="rounded-lg border p-3"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
        
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
          >
            Add user
          </button>
        </form>

        <input
          className="mb-6 w-full rounded-xl border bg-white p-3"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((user) => (
            <div
              key={user.id}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                selectedIds.includes(user.id)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
             <label className="absolute left-4 top-4 z-10 rounded bg-white p-2 shadow">
  <input
    type="checkbox"
    checked={selectedIds.includes(user.id)}
    onChange={() => handleSelect(user.id)}
    aria-label={`Select ${user.firstName}`}
  />
</label>

              <img
                src={user.photo}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-slate-500">ID</span>
                    <span className="font-semibold text-slate-800">
                      {user.id}
                    </span>
                  </div>

                  <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-slate-500">Age</span>
                    <span className="font-semibold text-slate-800">
                      {user.age}
                    </span>
                  </div>

                  <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-slate-500">City</span>
                    <span className="font-semibold text-slate-800">
                      {user.city}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-semibold text-slate-800">
                      {user.phone}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/details/${user.id}`, {
                        state: user,
                      })
                    }
                    className="rounded-lg bg-slate-700 px-3 py-2 text-white"
                  >
                    Info
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {editOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
            <form
              onSubmit={handleSubmit}
              className="relative z-50 grid w-full max-w-3xl gap-3 rounded-2xl bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-3"
            >
              <div className="col-span-full flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                  Edit user
                </h2>

                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-lg bg-slate-200 px-3 py-2"
                >
                  ✕
                </button>
              </div>

              <input
                className="rounded-lg border p-3"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}   
              />
              <input
                className="rounded-lg border p-3"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <input
                className="rounded-lg border p-3"
                placeholder="Age"
                type="number"
                min="1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                
              />

              <input
                className="rounded-lg border p-3"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                
              />

              <input
                className="rounded-lg border p-3"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                
              />

              <div className="col-span-full flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
                >
                  Save changes
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-lg bg-slate-200 px-5 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>

            <button
              type="button"
              aria-label="Close edit modal"
              onClick={clearForm}
              className="absolute inset-0"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function About() {
  return (
    <Provider store={reduxStore}>
      <Users />
    </Provider>
  );
}