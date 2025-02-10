import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const simpleVotingModule = buildModule("simpleVotingModule", (m) => {
  const simpleVoting = m.contract("SimpleVoting");

  return { simpleVoting };
});

export default simpleVotingModule;
