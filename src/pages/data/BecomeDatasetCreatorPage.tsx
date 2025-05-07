import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Upload} from "lucide-react"
import {cn} from "../../lib/utils/cn";
import Button from "../../components/designs/Button";
import {useNavigate} from "react-router-dom";

// Define the form schema with Zod
const formSchema = z.object({
  // name: z.string().min(1, { message: "Name is required" }),
  // email: z.string().email({ message: "Invalid email address" }),
  affiliation: z.string().min(1, {message: "Affiliation is required"}),
  expertise: z.string().optional(),
  reasonForJoining: z.string().optional(),
  pastWork: z.instanceof(FileList).optional(),
})


const schema = z.object({})

function BecomeDatasetCreatorPage() {
  const [requestSent, setRequestSent] = useState(false)
  const [fileSelected, setFileSelected] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      // email: "",
      affiliation: "",
      expertise: "",
      reasonForJoining: "",
    },
  })

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
    setRequestSent(true)
    // Here you would typically send the data to your API
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(e.target.files[0].name)
    } else {
      setFileSelected(null)
    }
  }
  return (
    <div className={cn('mt-12 max-w-7xl mx-auto')}>
      {requestSent ? (
        <div className={'flex items-center justify-center flex-col text-center gap-4 min-h-[60vh]'}>
          <div className={cn('mt-5 text-5xl')}>
            🚀
          </div>
          <h1 className={'text-2xl font-bold'}>Application Sent</h1>
          <p className={'max-w-[39ch]'}>Your application has been received! We’re reviewing your request and will notify
            you via email once approved.</p>
          <Button
            onClick={() => navigate('/')}
            className="rounded w-fit flex items-center justify-center gap-2">
            Go to Main Dashboard
          </Button>
        </div>
      ) : (
        <div>
          <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Become a Dataset Creator</h1>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col gap-2'}>
                {/*<div className="mb-4">*/}
                {/*  <label htmlFor="name" className="block text-sm font-medium mb-1">*/}
                {/*    Name <span className="text-red-500">*</span>*/}
                {/*  </label>*/}
                {/*  <input*/}
                {/*    id="name"*/}
                {/*    type="text"*/}
                {/*    placeholder="Enter your name"*/}
                {/*    className={`w-full p-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}*/}
                {/*    {...register("name")}*/}
                {/*  />*/}
                {/*  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}*/}
                {/*</div>*/}

                {/*<div className="mb-4">*/}
                {/*  <label htmlFor="email" className="block text-sm font-medium mb-1">*/}
                {/*    Email <span className="text-red-500">*</span>*/}
                {/*  </label>*/}
                {/*  <input*/}
                {/*    id="email"*/}
                {/*    type="email"*/}
                {/*    placeholder="Enter your email"*/}
                {/*    className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}*/}
                {/*    {...register("email")}*/}
                {/*  />*/}
                {/*  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}*/}
                {/*</div>*/}

                <div className="mb-4">
                  <label htmlFor="affiliation" className="block text-sm font-medium mb-1">
                    Affiliation <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="affiliation"
                    className={`w-full p-2 border rounded-md ${errors.affiliation ? "border-red-500" : "border-gray-300"}`}
                    {...register("affiliation")}
                  >
                    <option value="">i.e. Company, University, Research Group</option>
                    <option value="company">Company</option>
                    <option value="university">University</option>
                    <option value="research">Research Group</option>
                    <option value="independent">Independent Researcher</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.affiliation && <p className="mt-1 text-sm text-red-500">{errors.affiliation.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="expertise" className="block text-sm font-medium mb-1">
                    Expertise
                  </label>
                  <select id="expertise"
                          className="w-full p-2 border border-gray-300 rounded-md" {...register("expertise")}>
                    <option value="">i.e. Data Science, AI, Research</option>
                    <option value="data-science">Data Science</option>
                    <option value="ai">Artificial Intelligence</option>
                    <option value="ml">Machine Learning</option>
                    <option value="research">Research</option>
                    <option value="engineering">Engineering</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="reasonForJoining" className="block text-sm font-medium mb-1">
                    Reason for Joining
                  </label>
                  <textarea
                    id="reasonForJoining"
                    placeholder="Brief explanation"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...register("reasonForJoining")}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Upload any of your past work</label>
                  <div className="border border-gray-300 rounded-md p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2"/>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          {...register("pastWork")}
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF, CSV, XLS, DOC etc. (max. size 20 MB)</p>
                      {fileSelected && <p className="mt-2 text-sm text-gray-700">Selected: {fileSelected}</p>}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={'align-self-center'}

                >
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BecomeDatasetCreatorPage;
