import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        id: Number,
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Wallet Deposits">
        <div className="pt-2">
            {transactions.map(t =>
                <div key={Number(t.id)} className="flex justify-between my-1">
                <div>
                    <div className="text-sm">
                        Deposited INR
                    </div>
                    <div className="text-slate-800 text-xs">
                        status: <span className={`font-medium ${t.status == "Success" ? "text-green-700" : t.status == "Failure" ?"text-red-700" : "text-blue-700"}`}>{t.status}</span>
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center font-medium">
                        + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}