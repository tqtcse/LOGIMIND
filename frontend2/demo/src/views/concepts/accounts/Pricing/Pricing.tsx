import Card from '@/components/ui/Card'
import Plans from './components/Plans'
import PaymentCycleToggle from './components/PaymentCycleToggle'
import PaymentDialog from './components/PaymentDialog'

const Pricing = () => {
    return (
        <>
            <Card className="mb-4">
                <div className="flex items-center justify-between mb-8">
                    <h3>Gói</h3>
                    <PaymentCycleToggle />
                </div>
                <Plans />
            </Card>
            {/* <Faq /> */}
            <PaymentDialog />
        </>
    )
}

export default Pricing
