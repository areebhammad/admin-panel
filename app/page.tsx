"use client";
import { FC, useState, useEffect } from "react";
import Link from "next/link";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {}

const App: FC<Props> = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>([]);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const startEdit = (id: any) => {
    setEditingId(id);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const data: Member[] = await response.json();
    setMembers(data);
    setDisplayedMembers(getPage(data, page));
  };

  // const updateMember = (updatedMember: Member) => {
  //   const updatedMembers = members.map((m: Member) => {
  //     if (m.id === updatedMember.id) {
  //       return updatedMember;
  //     } else {
  //       return m;
  //     }
  //   });

  //   setMembers(prevState => updatedMembers);

  //   setEditingId(null);
  // };
  //
  // useEffect(() => {
  //   fetchMembers();
  // }, []);

  // const fetchMembers = async () => {
  //   const response = await fetch(
  //     "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  //   );
  //   const data = await response.json();
  //   setMembers(data);
  //   setDisplayedMembers(getPage(data, page));
  // };

  // Edit row
  // const editRow = (id: any) => {
  //   const member = members.find((m: any) => m.id === id);

  //   // Toggle edit mode
  //   member.isEditing = !member.isEditing;

  //   setMembers([...members]);
  // };

  // Update edited row
  // const updateMember = (updatedMember: any) => {
  //   const updatedMembers = members.map((m: any) =>
  //     m.id === updatedMember.id ? updatedMember : m
  //   );

  //   setMembers(updatedMembers);
  //   updatedMember.isEditing = false;
  // };

  //

  const getPage = (data: Member[], page: number) => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return data.slice(start, end);
  };

  const updatePage = (page: number) => {
    setPage(page);
    setDisplayedMembers(getPage(members, page));
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = members.filter((m) => {
      return (
        m.name.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm) ||
        m.role.toLowerCase().includes(searchTerm)
      );
    });
    setDisplayedMembers(getPage(filtered, 1));
    setPage(1);
  };

  const toggleSelect = (id: number) => {
    setSelected((selected) => {
      if (selected.includes(id)) {
        return selected.filter((x) => x !== id);
      } else {
        return [...selected, id];
      }
    });
  };

  const toggleSelectAll = () => {
    const ids = displayedMembers.map((m) => m.id);
    setSelected((selected) => {
      if (selected.length === ids.length) {
        return [];
      } else {
        return ids;
      }
    });
  };

  const deleteSelected = () => {
    const filtered = members.filter((m) => !selected.includes(m.id));
    setMembers(filtered);
    setDisplayedMembers(getPage(filtered, page));
    setSelected([]);
  };

  const deleteRow = (id: number) => {
    const filtered = members.filter((m) => m.id !== id);
    setMembers(filtered);

    // Update displayed members if needed
    if (displayedMembers.some((m) => m.id === id)) {
      setDisplayedMembers(getPage(filtered, page));
    }
  };

  // Delete row
  // const deleteRow = (id) => {
  //   const filtered = members.filter((m) => m.id !== id);
  //   setMembers(filtered);
  //   setDisplayedMembers(getPage(filtered, page));
  // };
  // Implement edit, delete row functions

  return (
    <div className="mx-5 my-10">
      <input
        className="search border px-2 py-1 rounded-md"
        placeholder="Search"
        onChange={onSearch}
      />
      <button
        className="delete-selected px-2 py-1 bg-blue-500 mx-2 rounded-md text-white"
        onClick={deleteSelected}
      >
        Delete Selected
      </button>
      <table className="mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selected.length === displayedMembers.length}
              />
            </th>
            <th className="border ">Name</th>
            <th className="border ">Email</th>
            <th className="border ">Role</th>
            <th className="border ">Actions</th>
          </tr>
        </thead>
        <tbody className="border">
          {displayedMembers.map((member) => (
            <tr
              key={member.id}
              className={selected.includes(member.id) ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(member.id)}
                  onChange={() => toggleSelect(member.id)}
                  className="border px-3 py-1"
                />
              </td>
              <td className="border px-3 py-1">{member.name}</td>
              <td className="border px-3 py-1">{member.email}</td>
              <td className="border px-3 py-1">{member.role}</td>
              <td>
                <button className="edit px-4 py-1 bg-blue-500 rounded-md text-white mx-2">
                  <Link href="/edit">Edit</Link>
                </button>
                <button
                  className="delete-selected px-2 py-1 bg-red-500 rounded-md text-white"
                  onClick={() => deleteRow(member.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          className="first-page px-4 py-2 bg-blue-400 m-4 rounded-md"
          onClick={() => updatePage(1)}
        >
          First
        </button>
        <button
          className="previous-page px-4 py-2 bg-blue-400 m-4 rounded-md"
          onClick={() => updatePage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        {/* Display page numbers */}
        <button
          className="next-page px-4 py-2 bg-blue-400 m-4 rounded-md"
          onClick={() => updatePage(page + 1)}
          disabled={page === 3}
        >
          Next
        </button>
        <button
          className="last-page px-4 py-2 bg-blue-400 m-4 rounded-md"
          onClick={() => updatePage(3)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default App;
