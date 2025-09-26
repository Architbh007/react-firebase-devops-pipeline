import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { verifyPassword } from "../lib/bcrypt";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("emailLower", "==", email.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (snap.empty) throw new Error("Invalid email or password.");
      const user = { id: snap.docs[0].id, ...snap.docs[0].data() };

      const ok = await verifyPassword(pw, user.passwordHash);
      if (!ok) throw new Error("Invalid email or password.");

      localStorage.setItem("user_data", JSON.stringify({
        userId: user.id, email: user.email, firstName: user.firstName, signedInAt: new Date().toISOString()
      }));
      nav("/home");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally { setLoading(false); }
  }

  const card = { maxWidth: 420, margin: "24px auto", background:"#fff", border:"1px solid #d6e1ff", borderRadius:8, padding:18, position:"relative" };
  const field = { display:"grid", gap:6, marginBottom:12 };
  const input = { padding:"10px 12px", borderRadius:6, border:"1px solid #e5e7eb" };
  const btn = { width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #2f6bff", background:"#2f6bff", color:"#fff", fontWeight:700, cursor:"pointer" };
  const errBox = { background:"#ffe8e8", border:"1px solid #ffc4c4", color:"#8b0000", padding:"8px 10px", borderRadius:6, marginBottom:10 };
  const linkBtn = { position:"absolute", right:12, top:12, fontSize:12, color:"#2f6bff", background:"#eef4ff", border:"1px solid #cfe0ff", borderRadius:6, padding:"4px 8px", textDecoration:"none" };

  return (
    <div style={card}>
      <Link to="/register" style={linkBtn}>Sign up</Link>
      <h2 style={{ textAlign:"center", margin:0, marginBottom:10 }}>Login</h2>

      {err && <div style={errBox}>{err}</div>}

      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label>Your email</label>
          <input style={input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={field}>
          <label>Your password</label>
          <input style={input} type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} required />
        </div>
        <button style={btn} disabled={loading} type="submit">{loading ? "Signing in…" : "Login"}</button>
      </form>

      <p style={{ marginTop:12, fontSize:14 }}>
        New here?{" "}
        <Link to="/register" style={{ color:"#2f6bff", textDecoration:"underline" }}>Create an account</Link>
      </p>
    </div>
  );
}
