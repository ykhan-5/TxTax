import type { SpendingCategory } from "@/lib/types/spending";

/**
 * Maps Texas state agency numbers to our 5 display categories.
 * Based on each agency's primary function, not expenditure type.
 *
 * Categories:
 * - education: K-12, higher education, teacher retirement
 * - health: Health & Human Services, medical boards, protective services
 * - transportation: TxDOT, DMV
 * - public_safety: Criminal justice, DPS, juvenile justice, military
 * - other: Legislature, judiciary, regulatory agencies, natural resources, etc.
 */
export const AGENCY_TO_CATEGORY: Record<string, SpendingCategory> = {
  // === Education ===
  // K-12 & General Education
  "701": "education", // Texas Education Agency
  "709": "education", // Texas A&M Forest Service (education-adjacent, but natural resources)

  // University Systems
  "710": "education", // University of Texas System
  "713": "education", // UT - Southwestern Medical Center
  "714": "education", // UT - Medical Branch at Galveston
  "715": "education", // UT - M.D. Anderson Cancer Center
  "716": "education", // UT - El Paso
  "717": "education", // UT - Austin
  "718": "education", // UT - Dallas
  "719": "education", // UT - Rio Grande Valley
  "720": "education", // Texas A&M University System
  "721": "education", // Prairie View A&M University
  "723": "education", // Texas A&M International University
  "724": "education", // Texas A&M University - Texarkana
  "726": "education", // Texas A&M AgriLife
  "727": "education", // Texas A&M Engineering Experiment Station
  "728": "education", // Texas A&M Transportation Institute
  "729": "education", // Texas A&M Engineering Extension
  "730": "education", // University of Houston System
  "731": "education", // University of Houston
  "733": "education", // Texas State University System
  "734": "education", // Lamar University
  "735": "education", // Midwestern State University
  "736": "education", // University of North Texas System
  "737": "education", // Texas Southern University
  "738": "education", // Sam Houston State University
  "739": "education", // Texas Tech University System
  "742": "education", // University of North Texas Health Science Center
  "743": "education", // UT - San Antonio
  "744": "education", // UT - Tyler
  "745": "education", // UT - Permian Basin
  "747": "education", // UT Health - Houston
  "749": "education", // Texas A&M University - San Antonio
  "750": "education", // UT Health - San Antonio
  "751": "education", // Texas A&M University - Commerce
  "752": "education", // University of North Texas - Dallas
  "753": "education", // Sam Houston State University (Huntsville)
  "754": "education", // Texas State Technical College System
  "756": "education", // Sul Ross State University
  "757": "education", // West Texas A&M University
  "758": "education", // Teacher Retirement System
  "759": "education", // School for the Blind and Visually Impaired
  "760": "education", // School for the Deaf
  "761": "education", // Texas A&M University - Corpus Christi
  "763": "education", // University of Houston - Clear Lake
  "764": "education", // University of Houston - Downtown
  "765": "education", // University of Houston - Victoria
  "769": "education", // Texas A&M University - Kingsville
  "770": "education", // Texas State University
  "771": "education", // UT - Arlington
  "772": "education", // Angelo State University
  "773": "education", // Lamar Institute of Technology
  "774": "education", // Lamar State College - Orange
  "775": "education", // Lamar State College - Port Arthur
  "781": "education", // Higher Education Coordinating Board
  "783": "education", // University of North Texas
  "784": "education", // Tarleton State University
  "785": "education", // Texas A&M - Central Texas
  "787": "education", // Texas Woman's University
  "788": "education", // Stephen F. Austin State University
  "789": "education", // Texas Tech University Health Sciences Center - El Paso

  // === Health & Human Services ===
  "503": "health", // Texas Medical Board
  "504": "health", // Texas State Board of Dental Examiners
  "506": "health", // University Interscholastic League (sports - edge case, maps to other)
  "507": "health", // Texas Optometry Board
  "508": "health", // Board of Chiropractic Examiners
  "510": "health", // State Board of Veterinary Medical Examiners
  "512": "health", // Board of Examiners of Psychologists
  "514": "health", // Board of Nursing
  "515": "health", // Board of Pharmacy
  "520": "health", // Board of Physical Therapy Examiners
  "529": "health", // Health and Human Services Commission (HHSC - largest)
  "530": "health", // Department of Family and Protective Services
  "537": "health", // Department of State Health Services
  "538": "health", // Statewide Health Coordinating Council
  "539": "health", // Department of Aging and Disability Services
  "542": "health", // Cancer Prevention and Research Institute

  // === Transportation ===
  "601": "transportation", // Texas Department of Transportation (TxDOT)
  "608": "transportation", // Texas Department of Motor Vehicles

  // === Public Safety & Criminal Justice ===
  "401": "public_safety", // Texas Military Department
  "403": "public_safety", // Texas Veterans Commission
  "405": "public_safety", // Department of Criminal Justice (TDCJ - prisons)
  "407": "public_safety", // Commission on Law Enforcement
  "409": "public_safety", // Commission on Jail Standards
  "454": "public_safety", // Department of Public Safety (DPS - state troopers)
  "644": "public_safety", // Juvenile Justice Department
  "696": "public_safety", // (If DPS is listed here too)

  // === Other (default catch-all) ===
  // Legislature
  "101": "other", // Senate
  "102": "other", // House of Representatives
  "103": "other", // Texas Legislative Council
  "104": "other", // Legislative Budget Board
  "105": "other", // Legislative Reference Library
  "107": "other", // Commission on Uniform State Laws
  "116": "other", // Sunset Advisory Commission

  // Judiciary
  "201": "other", // Supreme Court
  "211": "other", // Court of Criminal Appeals
  "212": "other", // Office of Court Administration
  "213": "other", // Office of State Prosecuting Attorney
  "215": "other", // Office of Capital and Forensic Writs
  "221": "other", // Courts of Appeals
  "222": "other",
  "223": "other",
  "224": "other",
  "225": "other",
  "226": "other",
  "227": "other",
  "228": "other",
  "229": "other",
  "230": "other",
  "231": "other",
  "232": "other",
  "233": "other",
  "234": "other",
  "241": "other", // Comptroller - Judiciary Section
  "242": "other", // Judicial Conduct Commission
  "243": "other", // State Law Library

  // Executive & Regulatory
  "300": "other", // Fiscal Programs - Comptroller
  "301": "other", // Office of the Governor
  "302": "other", // Attorney General
  "303": "other", // Texas Facilities Commission
  "304": "other", // Comptroller of Public Accounts
  "305": "other", // General Land Office
  "306": "other", // Library and Archives Commission
  "307": "other", // Secretary of State
  "308": "other", // State Auditor
  "312": "other", // State Securities Board
  "313": "other", // Department of Information Resources
  "315": "other", // Prepaid Higher Ed Tuition Board
  "320": "other", // Texas Workforce Commission
  "323": "other", // Teacher Retirement System (already in education)
  "325": "other", // Employees Retirement System
  "327": "other", // Emergency Communication District
  "329": "other", // Real Estate Commission
  "332": "other", // Housing & Community Affairs
  "338": "other", // State Pension Review Board
  "347": "other", // Bond Review Board
  "356": "other", // Ethics Commission
  "357": "other", // Insurance (Office of Public Insurance Counsel)
  "360": "other", // State Office of Risk Management
  "362": "other", // Texas Lottery Commission

  // Licensing & Regulatory
  "411": "other", // Board of Pardons and Paroles
  "448": "other", // Office of Public Utility Counsel
  "451": "other", // Department of Licensing and Regulation
  "452": "other", // Texas Alcoholic Beverage Commission
  "455": "other", // Railroad Commission
  "456": "other", // Board of Plumbing Examiners
  "458": "other", // Cosmetology Commission
  "459": "other", // Board of Architectural Examiners
  "460": "other", // Professional Engineers and Land Surveyors
  "464": "other", // Funeral Service Commission
  "466": "other", // Workforce Investment Council
  "469": "other", // Credit Union Commission
  "473": "other", // Public Utility Commission
  "476": "other", // Racing Commission
  "477": "other", // Commission on State Emergency Communications
  "479": "other", // State Office of Administrative Hearings
  "481": "other", // Texas Board of Professional Geoscientists

  // Natural Resources & Agriculture
  "551": "other", // Department of Agriculture
  "554": "other", // Animal Health Commission
  "555": "other", // Board of Veterinary Medical Examiners
  "556": "other", // Texas AgriLife Extension (also education-related)
  "576": "other", // Soil and Water Conservation Board
  "578": "other", // Emergency Management Division
  "580": "other", // Texas Water Development Board
  "582": "other", // Commission on Environmental Quality

  // Parks & Culture
  "802": "other", // Parks and Wildlife Department
  "808": "other", // Texas Historical Commission
  "809": "other", // State Preservation Board
  "813": "other", // Commission on the Arts

  // Fiscal
  "902": "other", // Comptroller - Fiscal Programs
  "907": "other", // Comptroller - Treasury Fiscal Programs
  "908": "other", // Comptroller - Fiscal
  "909": "other", // Broadband Development Office
  "930": "other", // Treasury Safekeeping Trust Company
};

/**
 * Get the display category for an agency number.
 * Falls back to 'other' for unknown agencies.
 */
export function getCategoryForAgency(agencyNumber: string): SpendingCategory {
  return AGENCY_TO_CATEGORY[agencyNumber] ?? "other";
}
