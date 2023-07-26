import Button from "@/components/ui/Button"
import { db } from "@/lib/db"
async function Home() {
  await db.set('hello','hello')
  return <Button variant={'ghost'}>test</Button>
}
export default Home