import {localSpecialty} from './professionalLocalization.js'
const categories={Contracts:/lawyer|legal|contract/i,Employment:/lawyer|human resources|career|payroll/i,Housing:/lawyer|housing|civil engineer/i,Privacy:/privacy|cyber|software/i,Finance:/account|econom|bookkeep|insurance/i,Health:/physician|dentist|pediatric|physio|medical|doctor/i,Engineering:/engineer/i}
export function relevantOpportunity(category,specialty){return Boolean(categories[category]?.test(localSpecialty(specialty,'en')))}
