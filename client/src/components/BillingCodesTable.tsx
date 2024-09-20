import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from '@mui/icons-material/Delete';
import { convertToRawFormat, parseBillingCodes } from "../services/soapNoteServices";

interface BillingCode {
  description: string;
  cpt: string;
  icd10: string;
}
interface BillingCodesTableProps {
    setIsEditing? : any;
    billingCodesText : string;
    setBillingCodesData : any ;
}

const BillingCodesTable: React.FC<BillingCodesTableProps> = ( {setIsEditing, billingCodesText, setBillingCodesData} ) => {
  const [billingCodes, setBillingCodes] = useState<BillingCode[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [editableCell, setEditableCell] = useState<{ row: number, field: keyof BillingCode } | null>(null);

  useEffect(()=>{
    initializeParsedBillingCodes();
  },[billingCodesText]);

  const initializeParsedBillingCodes = async()=>{
    setBillingCodes(await parseBillingCodes(billingCodesText));
  }
  const handleCopy = async () => {
    if(!billingCodes)return;
    const tableText = await convertToRawFormat(billingCodes);
    if(!tableText)return;
    navigator.clipboard.writeText(tableText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); // Reset icon after 5 seconds
    });
  };

  const handleCellChange = async (index: number, field: keyof BillingCode, value: string) => {
    if(!billingCodes)return;
    const updatedBillingCodes = billingCodes.map((code, i) =>
      i === index ? { ...code, [field]: value } : code
    );
    setBillingCodes(updatedBillingCodes);
    setBillingCodesData(await convertToRawFormat(updatedBillingCodes));
  };

  const handleCellClick = (row: number, field: keyof BillingCode) => {
    setIsEditing(true);
    setEditableCell({ row, field });
  };

  const handleBlur = () => {
    setEditableCell(null);
  };

  const handleAddRow = async () => {
    if(billingCodes){
        const updatedBillingCodes = [...billingCodes, { description: '', cpt: '', icd10: '' }];
        setBillingCodes(updatedBillingCodes);
        setBillingCodesData(await convertToRawFormat(updatedBillingCodes));
    }else{
        setBillingCodes([{ description: '', cpt: '', icd10: '' }]);
        setBillingCodesData(await convertToRawFormat([{ description: '', cpt: '', icd10: '' }]));
    }
    setIsEditing(true);
  };

  const handleRemoveRow = async (index: number) => {
    if (!billingCodes) return;
    const updatedBillingCodes = billingCodes.filter((_, i) => i !== index);
    setBillingCodes(updatedBillingCodes);
    setBillingCodesData(await convertToRawFormat(updatedBillingCodes));
    setIsEditing(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <IconButton onClick={handleCopy}>
          {copied ? <DoneIcon /> : <ContentCopyIcon />}
        </IconButton>
      </Box>
      <TableContainer component={Paper} sx={{ border: "2px solid #0085FE" }}>
        <Table aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#81C3FF" }}>
            <TableRow>
              <TableCell
                sx={{
                  borderRight: "2px solid #0085FE",
                  borderBottom: "2px solid #0085FE",
                }}
                align="center"
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  borderRight: "2px solid #0085FE",
                  borderBottom: "2px solid #0085FE",
                }}
                align="center"
              >
                CPT
              </TableCell>
              <TableCell
                sx={{ borderRight: "2px solid #0085FE", borderBottom: "2px solid #0085FE" }}
                align="center"
              >
                ICD-10
              </TableCell>
              <TableCell
                sx={{ borderBottom: "2px solid #0085FE" }}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingCodes &&
              billingCodes.map((code, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#D7ECFF",
                    borderBottom:
                      index !== billingCodes.length - 1
                        ? "2px solid #0085FE"
                        : "unset",
                  }}
                >
                  <TableCell
                    sx={{ borderRight: "2px solid #0085FE" }}
                    onClick={() => handleCellClick(index, "description")}
                  >
                    {editableCell?.row === index &&
                    editableCell.field === "description" ? (
                      <TextField
                        fullWidth
                        variant="standard"
                        value={code.description}
                        onChange={(e) =>
                          handleCellChange(index, "description", e.target.value)
                        }
                        onBlur={handleBlur}
                        autoFocus
                      />
                    ) : (
                      code.description
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ borderRight: "2px solid #0085FE" }}
                    align="center"
                    onClick={() => handleCellClick(index, "cpt")}
                  >
                    {editableCell?.row === index &&
                    editableCell.field === "cpt" ? (
                      <TextField
                        fullWidth
                        variant="standard"
                        value={code.cpt}
                        onChange={(e) =>
                          handleCellChange(index, "cpt", e.target.value)
                        }
                        onBlur={handleBlur}
                        autoFocus
                      />
                    ) : (
                      code.cpt
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ borderRight: "2px solid #0085FE" }}
                    align="center"
                    onClick={() => handleCellClick(index, "icd10")}
                  >
                    {editableCell?.row === index &&
                    editableCell.field === "icd10" ? (
                      <TextField
                        fullWidth
                        variant="standard"
                        value={code.icd10}
                        onChange={(e) =>
                          handleCellChange(index, "icd10", e.target.value)
                        }
                        onBlur={handleBlur}
                        autoFocus
                      />
                    ) : (
                      code.icd10
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => handleCellClick(index, "cpt")}
                  >
                    <IconButton onClick={() => handleRemoveRow(index)}>
                      <DeleteIcon sx={{color : "red"}} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button variant="contained" onClick={handleAddRow}>
          Add Row
        </Button>
      </Box>
    </Box>
  );
};

export default BillingCodesTable;
