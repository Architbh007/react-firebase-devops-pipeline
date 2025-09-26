import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { hashPassword } from "../lib/bcrypt";
import { Link, useNavigate } from "react-router-dom";

const emailRegex = /^(?=.{3,255}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setOk("");

    const emailLower = email.trim().toLowerCase();
    if (!emailRegex.test(emailLower)) return setErr("Please enter a valid email.");
    if (pw.length < 6) return setErr("Password must be at least 6 characters.");
    if (pw !== confirm) return setErr("Passwords do not match.");

    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");

    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("emailLower", "==", emailLower));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error("An account with this email already exists.");

      const passwordHash = await hashPassword(pw);

      await addDoc(collection(db, "users"), {
        firstName, lastName,
        email: email.trim(),
        emailLower,
        passwordHash,
        createdAt: serverTimestamp(),
      });

      setOk("Account created, Redirecting to login…");
      setTimeout(() => nav("/login"), 900);
    } catch (e2) {
      setErr(e2.message || "Registration failed.");
    } finally { setLoading(false); }
  }

  const card = { maxWidth: 520, margin: "24px auto", background:"#fff", border:"1px solid #d6e1ff", borderRadius:8, padding:18 };
  const field = { display:"grid", gap:6, marginBottom:12 };
  const input = { padding:"10px 12px", borderRadius:6, border:"1px solid #e5e7eb" };
  const btn = { width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #2f6bff", background:"#2f6bff", color:"#fff", fontWeight:700, cursor:"pointer" };
  const errBox = { background:"#ffe8e8", border:"1px solid #ffc4c4", color:"#8b0000", padding:"8px 10px", borderRadius:6, marginBottom:10 };
  const okBox  = { background:"#e7fff3", border:"1px solid #bff0d5", color:"#065f46", padding:"8px 10px", borderRadius:6, marginBottom:10 };

  return (
    <div style={card}>
      <h2 style={{ textAlign:"center", margin:0, marginBottom:10 }}>Create a DEV@Deakin Account</h2>

      {err && <div style={errBox}>{err}</div>}
      {ok && <div style={okBox}>{ok}</div>}

      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label>Name*</label>
          <input style={input} placeholder="Your name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
        </div>
        <div style={field}>
          <label>Email*</label>
          <input style={input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={field}>
          <label>Password*</label>
          <input style={input} type="password" placeholder="At least 6 characters" value={pw} onChange={e=>setPw(e.target.value)} required minLength={6} />
        </div>
        <div style={field}>
          <label>Confirm password*</label>
          <input style={input} type="password" placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        </div>
        <button style={btn} disabled={loading} type="submit">{loading ? "Creating…" : "Create"}</button>
      </form>

      <p style={{ marginTop:12, fontSize:14 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color:"#2f6bff", textDecoration:"underline" }}>Login</Link>
      </p>
    </div>
  );
}
