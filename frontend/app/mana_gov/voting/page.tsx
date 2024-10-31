export default function Voting() {
    return (
        <div className="flex min-h-screen flex-col items-center py-10 text-white">
            <div className="w-full max-w-4xl px-4">
                <header className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Governance Voting</h1>
                    <p className="text-lg">Participate in the governance by voting on proposals.</p>
                    {/* Need to add NEAR Wallet Login/Logout */}
                    <div>
                        <button className="rounded-lg bg-primary px-4 py-2 text-white">Login with NEAR</button>
                    </div>
                </header>

                <section className="mb-16">
                    <p className="text-center">Voting is not yet available. Coming soon!</p>
                </section>
            </div>
        </div>
    );
}