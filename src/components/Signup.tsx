import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      console.error('Signup error:', error)
      setError(error.message)
    } else {
      console.log('Signup success:', data)
      alert('Signup successful! Please check your email to confirm your account.')
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
