import React, { useState, useEffect } from "react";
import ContactForm from "./components/ContactForm";
import ContactsTable from "./components/ContactsTable";
import { getContacts } from "./api";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [contactToEdit, setContactToEdit] = useState(null);

  const fetchData = async () => {
    const data = await getContacts();
    setContacts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Contact Management</h1>
      <ContactForm fetchData={fetchData} contactToEdit={contactToEdit} setContactToEdit={setContactToEdit} />
      <ContactsTable contacts={contacts} fetchData={fetchData} setContactToEdit={setContactToEdit} />
    </div>
  );
};

export default App;
