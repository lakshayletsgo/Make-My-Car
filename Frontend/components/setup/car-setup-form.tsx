"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Car, Check, Fuel, MapPin, Gauge, Sparkles } from "lucide-react"
import { createCar, listCarBrands, listCarModels, listCities, type CarBrand, type CarModel, type City } from "@/lib/api"

const steps = [
  { id: 1, title: "Brand", description: "Select manufacturer", icon: Car },
  { id: 2, title: "Model", description: "Choose your model", icon: Gauge },
  { id: 3, title: "Details", description: "Variant & fuel type", icon: Fuel },
  { id: 4, title: "Location", description: "Your city", icon: MapPin },
]

const variants = ["Base", "Mid", "Top", "Fully Loaded"]
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]

export function CarSetupForm() {
  const router = useRouter()
  const [brands, setBrands] = useState<CarBrand[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    brand: "",
    brandId: "",
    model: "",
    modelId: "",
    variant: "",
    fuelType: "",
    city: "",
    cityId: "",
    year: "",
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadMeta() {
      try {
        const [brandRows, cityRows] = await Promise.all([listCarBrands(), listCities()])
        setBrands(brandRows)
        setCities(cityRows)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load car metadata")
      }
    }

    loadMeta()
  }, [])

  const availableModels = models

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.brand
      case 2: return !!formData.model && !!formData.modelId
      case 3: return !!formData.variant && !!formData.fuelType
      case 4: return !!formData.city && !!formData.cityId
      default: return false
    }
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError("")
      await createCar({
        brand_id: formData.brandId,
        model_id: formData.modelId,
        variant: formData.variant,
        fuel_type: formData.fuelType.toUpperCase(),
        year: Number(formData.year || new Date().getFullYear()),
        city_id: formData.cityId,
      })
      setSaved(true)
      setTimeout(() => {
        router.push("/recommendations")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save car profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/20 bg-card p-12 text-center shadow-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Car Profile Saved!</h2>
        <p className="text-muted-foreground">
          Redirecting you to personalized recommendations...
        </p>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
      {/* Header with Progress */}
      <div className="bg-muted/30 p-6 md:p-8 border-b border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Setup Your Car</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 4</p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                    s.id < step
                      ? "border-primary bg-primary text-primary-foreground"
                      : s.id === step
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {s.id < step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${
                  s.id <= step ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-8 md:w-16 lg:w-24 mx-2 transition-colors ${
                  s.id < step ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 md:p-8 min-h-80">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Select Your Car Brand</h3>
              <p className="mt-1 text-sm text-muted-foreground">Choose the manufacturer of your vehicle.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={async () => {
                    setFormData({ ...formData, brand: brand.name, brandId: brand.id, model: "", modelId: "" })
                    try {
                      const modelRows = await listCarModels(brand.id)
                      setModels(modelRows)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Failed to load models")
                    }
                  }}
                  className={`rounded-xl border p-4 text-center text-sm font-medium transition-all ${
                    formData.brand === brand.name
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Select Your Model</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the model of your {formData.brand}.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setFormData({ ...formData, model: model.name, modelId: model.id })}
                  className={`rounded-xl border p-4 text-center text-sm font-medium transition-all ${
                    formData.model === model.name
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Car Details</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select the variant and fuel type of your {formData.brand} {formData.model}.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Variant</label>
                <Select
                  value={formData.variant}
                  onValueChange={(v) => setFormData({ ...formData, variant: v })}
                >
                  <SelectTrigger className="h-12 border-border bg-background">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Fuel Type</label>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                  {fuelTypes.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setFormData({ ...formData, fuelType: fuel })}
                      className={`rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                        formData.fuelType === fuel
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Year (Optional)</label>
                <Input
                  placeholder="e.g. 2023"
                  className="h-12 border-border bg-background"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Your Location</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your city for location-based recommendations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setFormData({ ...formData, city: city.name, cityId: city.id })}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${
                    formData.city === city.name
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  {city.name}
                </button>
              ))}
            </div>

            {/* Summary */}
            {formData.city && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  Your Car Profile
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="text-foreground font-medium">{formData.brand}</span>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="text-foreground font-medium">{formData.model}</span>
                  <span className="text-muted-foreground">Variant:</span>
                  <span className="text-foreground font-medium">{formData.variant}</span>
                  <span className="text-muted-foreground">Fuel:</span>
                  <span className="text-foreground font-medium">{formData.fuelType}</span>
                  <span className="text-muted-foreground">City:</span>
                  <span className="text-foreground font-medium">{formData.city}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 p-6 md:p-8">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="border-border hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={!canProceed() || isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            {isSaving ? "Saving..." : "Save & Get Recommendations"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
