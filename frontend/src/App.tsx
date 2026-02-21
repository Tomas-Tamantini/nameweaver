import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Nameweaver UI Preview
        </h1>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Person Card</CardTitle>
                <CardDescription>
                  Quick preview for theme comparison.
                </CardDescription>
              </div>
              <Badge variant="secondary">Preview</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Ada Lovelace" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Met at the conference. Works with data visualization."
              />
            </div>
          </CardContent>

          <CardFooter className="gap-2">
            <Button>Save person</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

export default App
