import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createPerson } from '@/features/people/services/people-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const addPersonFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(100, 'Name must be at most 100 characters.'),
  description: z
    .string()
    .trim()
    .min(1, 'Short description is required.')
    .max(280, 'Short description must be at most 280 characters.'),
})

type AddPersonFormValues = z.infer<typeof addPersonFormSchema>

function AddPersonPage() {
  const navigate = useNavigate()
  const [serviceError, setServiceError] = useState<string | null>(null)

  const form = useForm<AddPersonFormValues>({
    resolver: zodResolver(addPersonFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function onSubmit(values: AddPersonFormValues) {
    setServiceError(null)

    try {
      await createPerson(values)
      toast.success('Person added')
      navigate('/people')
    } catch (error) {
      setServiceError(
        getApiErrorMessage(error, 'Could not save person. Please try again.'),
      )
    }
  }

  return (
    <section aria-label="Add person page" className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Add person</h1>

      <Card>
        <CardHeader>
          <CardTitle>Person details</CardTitle>
          <CardDescription>
            Add basic context so this person is easier to remember later.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="add-person-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {serviceError && (
                <Alert variant="destructive">
                  <AlertTitle>Could not save person</AlertTitle>
                  <AlertDescription>{serviceError}</AlertDescription>
                </Alert>
              )}

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="add-person-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="add-person-name"
                      autoComplete="off"
                      placeholder="Ada Lovelace"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="add-person-short-description">
                      Short description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="add-person-short-description"
                      rows={4}
                      placeholder="Met at a conference and discussed math education."
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button
            asChild
            variant="outline"
            className="min-w-24"
            disabled={form.formState.isSubmitting}
          >
            <Link to="/people">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form="add-person-form"
            className="min-w-24"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save person'}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}

export default AddPersonPage
